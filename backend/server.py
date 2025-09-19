from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Income & Expense Tracker API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    if doc and "_id" in doc:
        del doc["_id"]  # Remove MongoDB ObjectId, keep the integer id field
    return doc

# === MODELS ===

class Category(BaseModel):
    id: Optional[int] = None
    name: str
    type: str  # 'income' or 'expense'
    color: str

class CategoryCreate(BaseModel):
    name: str
    type: str
    color: str

class Account(BaseModel):
    id: Optional[int] = None
    name: str
    type: str  # 'checking', 'savings', 'credit'
    balance: float
    lowBalanceThreshold: float

class AccountCreate(BaseModel):
    name: str
    type: str
    balance: float
    lowBalanceThreshold: float

class Transaction(BaseModel):
    id: Optional[int] = None
    date: str
    type: str  # 'income' or 'expense'
    amount: float
    categoryId: int
    categoryName: str
    accountId: int
    accountName: str
    clientVendorId: Optional[int] = None
    clientVendorName: str = ""
    status: str  # 'completed', 'pending', 'overdue'
    notes: str = ""
    recurring: bool = False

class TransactionCreate(BaseModel):
    date: str
    type: str
    amount: float
    categoryId: int
    accountId: int
    clientVendorId: Optional[int] = None
    status: str = "completed"
    notes: str = ""
    recurring: bool = False

class Client(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    paymentTerms: str

class ClientCreate(BaseModel):
    name: str
    email: str
    paymentTerms: str

class Vendor(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    defaultCategory: str

class VendorCreate(BaseModel):
    name: str
    email: str
    defaultCategory: str

class Budget(BaseModel):
    categoryId: int
    categoryName: str
    monthlyBudget: float
    spent: float = 0.0

class BudgetCreate(BaseModel):
    categoryId: int
    monthlyBudget: float

# === CATEGORIES ENDPOINTS ===

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find().to_list(1000)
    return [Category(**serialize_doc(cat)) for cat in categories]

@api_router.post("/categories", response_model=Category)
async def create_category(category: CategoryCreate):
    # Get next ID
    last_cat = await db.categories.find_one(sort=[("id", -1)])
    next_id = (last_cat["id"] + 1) if last_cat and "id" in last_cat else 1
    
    category_dict = category.dict()
    category_dict["id"] = next_id
    
    result = await db.categories.insert_one(category_dict)
    created_category = await db.categories.find_one({"_id": result.inserted_id})
    return Category(**serialize_doc(created_category))

@api_router.put("/categories/{category_id}", response_model=Category)
async def update_category(category_id: int, category: CategoryCreate):
    result = await db.categories.update_one(
        {"id": category_id},
        {"$set": category.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    updated_category = await db.categories.find_one({"id": category_id})
    return Category(**serialize_doc(updated_category))

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: int):
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}

# === ACCOUNTS ENDPOINTS ===

@api_router.get("/accounts", response_model=List[Account])
async def get_accounts():
    accounts = await db.accounts.find().to_list(1000)
    return [Account(**serialize_doc(acc)) for acc in accounts]

@api_router.post("/accounts", response_model=Account)
async def create_account(account: AccountCreate):
    last_acc = await db.accounts.find_one(sort=[("id", -1)])
    next_id = (last_acc["id"] + 1) if last_acc and "id" in last_acc else 1
    
    account_dict = account.dict()
    account_dict["id"] = next_id
    
    result = await db.accounts.insert_one(account_dict)
    created_account = await db.accounts.find_one({"_id": result.inserted_id})
    return Account(**serialize_doc(created_account))

@api_router.put("/accounts/{account_id}", response_model=Account)
async def update_account(account_id: int, account: AccountCreate):
    result = await db.accounts.update_one(
        {"id": account_id},
        {"$set": account.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Account not found")
    
    updated_account = await db.accounts.find_one({"id": account_id})
    return Account(**serialize_doc(updated_account))

@api_router.delete("/accounts/{account_id}")
async def delete_account(account_id: int):
    result = await db.accounts.delete_one({"id": account_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Account not found")
    return {"message": "Account deleted successfully"}

# === TRANSACTIONS ENDPOINTS ===

@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(
    type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    filter_dict = {}
    
    if type and type != "all":
        filter_dict["type"] = type
    if status and status != "all":
        filter_dict["status"] = status
    if search:
        filter_dict["$or"] = [
            {"categoryName": {"$regex": search, "$options": "i"}},
            {"notes": {"$regex": search, "$options": "i"}},
            {"clientVendorName": {"$regex": search, "$options": "i"}}
        ]
    
    transactions = await db.transactions.find(filter_dict).sort("date", -1).to_list(1000)
    return [Transaction(**serialize_doc(trans)) for trans in transactions]

@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(transaction: TransactionCreate):
    # Get category and account names
    category = await db.categories.find_one({"id": transaction.categoryId})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    account = await db.accounts.find_one({"id": transaction.accountId})
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    # Get client/vendor name if provided
    client_vendor_name = ""
    if transaction.clientVendorId:
        client = await db.clients.find_one({"id": transaction.clientVendorId})
        vendor = await db.vendors.find_one({"id": transaction.clientVendorId})
        if client:
            client_vendor_name = client["name"]
        elif vendor:
            client_vendor_name = vendor["name"]
    
    # Generate next ID
    last_trans = await db.transactions.find_one(sort=[("id", -1)])
    next_id = (last_trans["id"] + 1) if last_trans and "id" in last_trans else 1
    
    transaction_dict = transaction.dict()
    transaction_dict["id"] = next_id
    transaction_dict["categoryName"] = category["name"]
    transaction_dict["accountName"] = account["name"]
    transaction_dict["clientVendorName"] = client_vendor_name
    
    result = await db.transactions.insert_one(transaction_dict)
    created_transaction = await db.transactions.find_one({"_id": result.inserted_id})
    return Transaction(**serialize_doc(created_transaction))

@api_router.put("/transactions/{transaction_id}", response_model=Transaction)
async def update_transaction(transaction_id: int, transaction: TransactionCreate):
    # Get category and account names
    category = await db.categories.find_one({"id": transaction.categoryId})
    account = await db.accounts.find_one({"id": transaction.accountId})
    
    if not category or not account:
        raise HTTPException(status_code=404, detail="Category or Account not found")
    
    # Get client/vendor name if provided
    client_vendor_name = ""
    if transaction.clientVendorId:
        client = await db.clients.find_one({"id": transaction.clientVendorId})
        vendor = await db.vendors.find_one({"id": transaction.clientVendorId})
        if client:
            client_vendor_name = client["name"]
        elif vendor:
            client_vendor_name = vendor["name"]
    
    transaction_dict = transaction.dict()
    transaction_dict["categoryName"] = category["name"]
    transaction_dict["accountName"] = account["name"]
    transaction_dict["clientVendorName"] = client_vendor_name
    
    result = await db.transactions.update_one(
        {"id": transaction_id},
        {"$set": transaction_dict}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    updated_transaction = await db.transactions.find_one({"id": transaction_id})
    return Transaction(**serialize_doc(updated_transaction))

@api_router.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: int):
    result = await db.transactions.delete_one({"id": transaction_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted successfully"}

# === CLIENTS ENDPOINTS ===

@api_router.get("/clients", response_model=List[Client])
async def get_clients():
    clients = await db.clients.find().to_list(1000)
    return [Client(**serialize_doc(client)) for client in clients]

@api_router.post("/clients", response_model=Client)
async def create_client(client: ClientCreate):
    last_client = await db.clients.find_one(sort=[("id", -1)])
    next_id = (last_client["id"] + 1) if last_client and "id" in last_client else 1
    
    client_dict = client.dict()
    client_dict["id"] = next_id
    
    result = await db.clients.insert_one(client_dict)
    created_client = await db.clients.find_one({"_id": result.inserted_id})
    return Client(**serialize_doc(created_client))

@api_router.put("/clients/{client_id}", response_model=Client)
async def update_client(client_id: int, client: ClientCreate):
    result = await db.clients.update_one(
        {"id": client_id},
        {"$set": client.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    
    updated_client = await db.clients.find_one({"id": client_id})
    return Client(**serialize_doc(updated_client))

@api_router.delete("/clients/{client_id}")
async def delete_client(client_id: int):
    result = await db.clients.delete_one({"id": client_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    return {"message": "Client deleted successfully"}

# === VENDORS ENDPOINTS ===

@api_router.get("/vendors", response_model=List[Vendor])
async def get_vendors():
    vendors = await db.vendors.find().to_list(1000)
    return [Vendor(**serialize_doc(vendor)) for vendor in vendors]

@api_router.post("/vendors", response_model=Vendor)
async def create_vendor(vendor: VendorCreate):
    last_vendor = await db.vendors.find_one(sort=[("id", -1)])
    next_id = (last_vendor["id"] + 1) if last_vendor and "id" in last_vendor else 1
    
    vendor_dict = vendor.dict()
    vendor_dict["id"] = next_id
    
    result = await db.vendors.insert_one(vendor_dict)
    created_vendor = await db.vendors.find_one({"_id": result.inserted_id})
    return Vendor(**serialize_doc(created_vendor))

@api_router.put("/vendors/{vendor_id}", response_model=Vendor)
async def update_vendor(vendor_id: int, vendor: VendorCreate):
    result = await db.vendors.update_one(
        {"id": vendor_id},
        {"$set": vendor.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    updated_vendor = await db.vendors.find_one({"id": vendor_id})
    return Vendor(**serialize_doc(updated_vendor))

@api_router.delete("/vendors/{vendor_id}")
async def delete_vendor(vendor_id: int):
    result = await db.vendors.delete_one({"id": vendor_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return {"message": "Vendor deleted successfully"}

# === BUDGETS ENDPOINTS ===

@api_router.get("/budgets", response_model=List[Budget])
async def get_budgets():
    budgets = await db.budgets.find().to_list(1000)
    
    # Calculate spent amounts from transactions
    for budget in budgets:
        spent = await db.transactions.aggregate([
            {
                "$match": {
                    "categoryId": budget["categoryId"],
                    "type": "expense",
                    "status": "completed"
                }
            },
            {
                "$group": {
                    "_id": None,
                    "total": {"$sum": "$amount"}
                }
            }
        ]).to_list(1)
        
        budget["spent"] = spent[0]["total"] if spent else 0.0
        
        # Get category name
        category = await db.categories.find_one({"id": budget["categoryId"]})
        budget["categoryName"] = category["name"] if category else ""
    
    return [Budget(**serialize_doc(budget)) for budget in budgets]

@api_router.post("/budgets", response_model=Budget)
async def create_budget(budget: BudgetCreate):
    category = await db.categories.find_one({"id": budget.categoryId})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    budget_dict = budget.dict()
    budget_dict["categoryName"] = category["name"]
    budget_dict["spent"] = 0.0
    
    result = await db.budgets.insert_one(budget_dict)
    created_budget = await db.budgets.find_one({"_id": result.inserted_id})
    return Budget(**serialize_doc(created_budget))

@api_router.put("/budgets/{category_id}", response_model=Budget)
async def update_budget(category_id: int, budget: BudgetCreate):
    category = await db.categories.find_one({"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    result = await db.budgets.update_one(
        {"categoryId": category_id},
        {"$set": {"monthlyBudget": budget.monthlyBudget}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    updated_budget = await db.budgets.find_one({"categoryId": category_id})
    return Budget(**serialize_doc(updated_budget))

@api_router.delete("/budgets/{category_id}")
async def delete_budget(category_id: int):
    result = await db.budgets.delete_one({"categoryId": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Budget not found")
    return {"message": "Budget deleted successfully"}

# === DASHBOARD ENDPOINTS ===

@api_router.get("/dashboard/kpis")
async def get_dashboard_kpis():
    # Calculate KPIs from transactions
    completed_transactions = await db.transactions.find({"status": "completed"}).to_list(1000)
    
    total_income = sum(t["amount"] for t in completed_transactions if t["type"] == "income")
    total_expenses = sum(t["amount"] for t in completed_transactions if t["type"] == "expense")
    balance = total_income - total_expenses
    
    pending_count = await db.transactions.count_documents({"status": "pending"})
    overdue_count = await db.transactions.count_documents({"status": "overdue"})
    
    return {
        "totalIncome": total_income,
        "totalExpenses": total_expenses,
        "balance": balance,
        "netProfit": max(balance, 0),
        "pendingTransactions": pending_count,
        "overdueTransactions": overdue_count
    }

@api_router.get("/dashboard/charts")
async def get_dashboard_charts():
    # This would return chart data - simplified for now
    return {
        "message": "Chart data endpoint - implement based on frontend needs"
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
