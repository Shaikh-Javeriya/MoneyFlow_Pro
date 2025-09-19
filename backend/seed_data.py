#!/usr/bin/env python3
"""
Data seeding script for Income & Expense Tracker
Populates MongoDB with initial mock data
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Mock data
categories_data = [
    # Income Categories  
    {"id": 1, "name": "Salary", "type": "income", "color": "#10b981"},
    {"id": 2, "name": "Freelance", "type": "income", "color": "#059669"},
    {"id": 3, "name": "Investments", "type": "income", "color": "#047857"},
    {"id": 4, "name": "Business", "type": "income", "color": "#065f46"},
    {"id": 5, "name": "Other Income", "type": "income", "color": "#064e3b"},
    
    # Expense Categories
    {"id": 6, "name": "Rent", "type": "expense", "color": "#ef4444"},
    {"id": 7, "name": "Food", "type": "expense", "color": "#dc2626"},
    {"id": 8, "name": "Utilities", "type": "expense", "color": "#b91c1c"},
    {"id": 9, "name": "Travel", "type": "expense", "color": "#991b1b"},
    {"id": 10, "name": "Subscriptions", "type": "expense", "color": "#7f1d1d"},
    {"id": 11, "name": "Healthcare", "type": "expense", "color": "#f97316"},
    {"id": 12, "name": "Entertainment", "type": "expense", "color": "#ea580c"},
    {"id": 13, "name": "Shopping", "type": "expense", "color": "#c2410c"},
]

accounts_data = [
    {"id": 1, "name": "Main Checking", "type": "checking", "balance": 5420.50, "lowBalanceThreshold": 500},
    {"id": 2, "name": "Savings Account", "type": "savings", "balance": 12800.75, "lowBalanceThreshold": 1000},
    {"id": 3, "name": "Credit Card", "type": "credit", "balance": -1250.30, "lowBalanceThreshold": -5000},
    {"id": 4, "name": "Business Account", "type": "checking", "balance": 8960.25, "lowBalanceThreshold": 1000},
]

clients_data = [
    {"id": 1, "name": "ABC Corporation", "paymentTerms": "NET 30", "email": "billing@abc.com"},
    {"id": 2, "name": "XYZ Industries", "paymentTerms": "NET 15", "email": "payments@xyz.com"},
    {"id": 3, "name": "Tech Solutions Ltd", "paymentTerms": "Immediate", "email": "finance@techsol.com"},
    {"id": 4, "name": "Global Ventures", "paymentTerms": "NET 45", "email": "accounts@global.com"},
    {"id": 5, "name": "StartUp Inc", "paymentTerms": "NET 30", "email": "billing@startup.com"},
]

vendors_data = [
    {"id": 1, "name": "Office Supplies Co", "defaultCategory": "Business Expenses", "email": "sales@office.com"},
    {"id": 2, "name": "Internet Provider", "defaultCategory": "Utilities", "email": "billing@internet.com"},
    {"id": 3, "name": "Software Subscriptions", "defaultCategory": "Subscriptions", "email": "support@software.com"},
    {"id": 4, "name": "Local Restaurant", "defaultCategory": "Food", "email": "orders@restaurant.com"},
    {"id": 5, "name": "Gas Station", "defaultCategory": "Travel", "email": "info@gasstation.com"},
]

budgets_data = [
    {"categoryId": 6, "categoryName": "Rent", "monthlyBudget": 1000, "spent": 0},
    {"categoryId": 7, "categoryName": "Food", "monthlyBudget": 500, "spent": 0},
    {"categoryId": 8, "categoryName": "Utilities", "monthlyBudget": 200, "spent": 0},
    {"categoryId": 9, "categoryName": "Travel", "monthlyBudget": 300, "spent": 0},
    {"categoryId": 10, "categoryName": "Subscriptions", "monthlyBudget": 150, "spent": 0},
    {"categoryId": 11, "categoryName": "Healthcare", "monthlyBudget": 400, "spent": 0},
    {"categoryId": 12, "categoryName": "Entertainment", "monthlyBudget": 250, "spent": 0},
    {"categoryId": 13, "categoryName": "Shopping", "monthlyBudget": 200, "spent": 0},
]

transactions_data = [
    # Sample transactions
    {"id": 1, "date": "2024-12-15", "type": "income", "amount": 5000, "categoryId": 1, "categoryName": "Salary", "accountId": 1, "accountName": "Main Checking", "clientVendorId": 1, "clientVendorName": "ABC Corporation", "status": "completed", "notes": "Monthly salary", "recurring": True},
    {"id": 2, "date": "2024-12-10", "type": "income", "amount": 1500, "categoryId": 2, "categoryName": "Freelance", "accountId": 1, "accountName": "Main Checking", "clientVendorId": 2, "clientVendorName": "XYZ Industries", "status": "completed", "notes": "Web development project", "recurring": False},
    {"id": 3, "date": "2024-12-05", "type": "income", "amount": 200, "categoryId": 3, "categoryName": "Investments", "accountId": 2, "accountName": "Savings Account", "clientVendorId": None, "clientVendorName": "", "status": "completed", "notes": "Dividend payment", "recurring": True},
    {"id": 4, "date": "2024-11-15", "type": "income", "amount": 5000, "categoryId": 1, "categoryName": "Salary", "accountId": 1, "accountName": "Main Checking", "clientVendorId": 1, "clientVendorName": "ABC Corporation", "status": "completed", "notes": "Monthly salary", "recurring": True},
    {"id": 5, "date": "2024-11-20", "type": "income", "amount": 800, "categoryId": 2, "categoryName": "Freelance", "accountId": 4, "accountName": "Business Account", "clientVendorId": 3, "clientVendorName": "Tech Solutions Ltd", "status": "completed", "notes": "Consulting work", "recurring": False},
    
    # Expense transactions
    {"id": 6, "date": "2024-12-01", "type": "expense", "amount": 1000, "categoryId": 6, "categoryName": "Rent", "accountId": 1, "accountName": "Main Checking", "clientVendorId": None, "clientVendorName": "", "status": "completed", "notes": "Monthly rent payment", "recurring": True},
    {"id": 7, "date": "2024-12-14", "type": "expense", "amount": 85.50, "categoryId": 7, "categoryName": "Food", "accountId": 3, "accountName": "Credit Card", "clientVendorId": 4, "clientVendorName": "Local Restaurant", "status": "completed", "notes": "Grocery shopping", "recurring": False},
    {"id": 8, "date": "2024-12-12", "type": "expense", "amount": 120, "categoryId": 8, "categoryName": "Utilities", "accountId": 1, "accountName": "Main Checking", "clientVendorId": 2, "clientVendorName": "Internet Provider", "status": "completed", "notes": "Internet bill", "recurring": True},
    {"id": 9, "date": "2024-12-08", "type": "expense", "amount": 65, "categoryId": 9, "categoryName": "Travel", "accountId": 3, "accountName": "Credit Card", "clientVendorId": 5, "clientVendorName": "Gas Station", "status": "completed", "notes": "Gas fill-up", "recurring": False},
    {"id": 10, "date": "2024-12-07", "type": "expense", "amount": 29.99, "categoryId": 10, "categoryName": "Subscriptions", "accountId": 3, "accountName": "Credit Card", "clientVendorId": 3, "clientVendorName": "Software Subscriptions", "status": "completed", "notes": "Netflix subscription", "recurring": True},
    
    # Additional transactions
    {"id": 11, "date": "2024-11-28", "type": "expense", "amount": 450, "categoryId": 11, "categoryName": "Healthcare", "accountId": 1, "accountName": "Main Checking", "clientVendorId": None, "clientVendorName": "", "status": "completed", "notes": "Doctor visit", "recurring": False},
    {"id": 12, "date": "2024-11-25", "type": "expense", "amount": 180, "categoryId": 12, "categoryName": "Entertainment", "accountId": 3, "accountName": "Credit Card", "clientVendorId": None, "clientVendorName": "", "status": "completed", "notes": "Movie tickets", "recurring": False},
    {"id": 13, "date": "2024-11-22", "type": "expense", "amount": 299.99, "categoryId": 13, "categoryName": "Shopping", "accountId": 3, "accountName": "Credit Card", "clientVendorId": None, "clientVendorName": "", "status": "completed", "notes": "Clothing purchase", "recurring": False},
    {"id": 14, "date": "2024-11-20", "type": "income", "amount": 300, "categoryId": 4, "categoryName": "Business", "accountId": 4, "accountName": "Business Account", "clientVendorId": 4, "clientVendorName": "Global Ventures", "status": "pending", "notes": "Consultation fee", "recurring": False},
    {"id": 15, "date": "2024-11-18", "type": "expense", "amount": 75, "categoryId": 7, "categoryName": "Food", "accountId": 1, "accountName": "Main Checking", "clientVendorId": None, "clientVendorName": "", "status": "completed", "notes": "Restaurant dinner", "recurring": False},
    
    # More recent transactions
    {"id": 16, "date": "2024-12-20", "type": "income", "amount": 2000, "categoryId": 2, "categoryName": "Freelance", "accountId": 4, "accountName": "Business Account", "clientVendorId": 5, "clientVendorName": "StartUp Inc", "status": "completed", "notes": "Project completion bonus", "recurring": False},
    {"id": 17, "date": "2024-12-18", "type": "expense", "amount": 150, "categoryId": 7, "categoryName": "Food", "accountId": 3, "accountName": "Credit Card", "clientVendorId": None, "clientVendorName": "", "status": "completed", "notes": "Weekly groceries", "recurring": False},
    {"id": 18, "date": "2024-12-16", "type": "expense", "amount": 89.99, "categoryId": 10, "categoryName": "Subscriptions", "accountId": 3, "accountName": "Credit Card", "clientVendorId": None, "clientVendorName": "", "status": "completed", "notes": "Software license", "recurring": True},
    {"id": 19, "date": "2024-12-13", "type": "expense", "amount": 45, "categoryId": 9, "categoryName": "Travel", "accountId": 1, "accountName": "Main Checking", "clientVendorId": None, "clientVendorName": "", "status": "completed", "notes": "Taxi fare", "recurring": False},
    {"id": 20, "date": "2024-12-11", "type": "income", "amount": 150, "categoryId": 3, "categoryName": "Investments", "accountId": 2, "accountName": "Savings Account", "clientVendorId": None, "clientVendorName": "", "status": "completed", "notes": "Stock dividends", "recurring": False},
]

async def seed_database():
    """Seed the database with initial data"""
    print("🌱 Starting database seeding...")
    
    try:
        # Clear existing data
        print("🧹 Clearing existing data...")
        await db.categories.delete_many({})
        await db.accounts.delete_many({})
        await db.clients.delete_many({})
        await db.vendors.delete_many({})
        await db.budgets.delete_many({})
        await db.transactions.delete_many({})
        
        # Insert categories
        print("📁 Inserting categories...")
        await db.categories.insert_many(categories_data)
        
        # Insert accounts
        print("🏦 Inserting accounts...")
        await db.accounts.insert_many(accounts_data)
        
        # Insert clients
        print("👥 Inserting clients...")
        await db.clients.insert_many(clients_data)
        
        # Insert vendors
        print("🚚 Inserting vendors...")
        await db.vendors.insert_many(vendors_data)
        
        # Insert budgets
        print("💰 Inserting budgets...")
        await db.budgets.insert_many(budgets_data)
        
        # Insert transactions
        print("💳 Inserting transactions...")
        await db.transactions.insert_many(transactions_data)
        
        # Verify data
        categories_count = await db.categories.count_documents({})
        accounts_count = await db.accounts.count_documents({})
        clients_count = await db.clients.count_documents({})
        vendors_count = await db.vendors.count_documents({})
        budgets_count = await db.budgets.count_documents({})
        transactions_count = await db.transactions.count_documents({})
        
        print("✅ Database seeding completed successfully!")
        print(f"   📁 Categories: {categories_count}")
        print(f"   🏦 Accounts: {accounts_count}")
        print(f"   👥 Clients: {clients_count}")
        print(f"   🚚 Vendors: {vendors_count}")
        print(f"   💰 Budgets: {budgets_count}")
        print(f"   💳 Transactions: {transactions_count}")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        raise
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())