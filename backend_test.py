#!/usr/bin/env python3
"""
Backend API Testing Suite for Income & Expense Tracker
Tests all CRUD operations for Categories, Accounts, Transactions, Clients, Vendors, Budgets, and Dashboard APIs
"""

import requests
import json
import sys
from typing import Dict, Any, List, Optional

# Backend URL from environment
BASE_URL = "https://finance-tracker-550.preview.emergentagent.com/api"

class APITester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        self.created_ids = {
            'categories': [],
            'accounts': [],
            'transactions': [],
            'clients': [],
            'vendors': [],
            'budgets': []
        }
    
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        self.test_results.append({
            'test': test_name,
            'success': success,
            'details': details
        })
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, params: Dict = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{self.base_url}{endpoint}"
        try:
            if method == "GET":
                response = self.session.get(url, params=params)
            elif method == "POST":
                response = self.session.post(url, json=data)
            elif method == "PUT":
                response = self.session.put(url, json=data)
            elif method == "DELETE":
                response = self.session.delete(url)
            else:
                return False, f"Unsupported method: {method}", 0
            
            return response.status_code < 400, response.json() if response.content else {}, response.status_code
        except requests.exceptions.RequestException as e:
            return False, f"Request failed: {str(e)}", 0
        except json.JSONDecodeError:
            return False, "Invalid JSON response", response.status_code if 'response' in locals() else 0

    # === CATEGORIES TESTS ===
    
    def test_categories_get(self):
        """Test GET /api/categories"""
        success, data, status_code = self.make_request("GET", "/categories")
        if success and isinstance(data, list):
            self.log_test("GET Categories", True, f"Retrieved {len(data)} categories")
            return data
        else:
            self.log_test("GET Categories", False, f"Status: {status_code}, Data: {data}")
            return []
    
    def test_categories_post(self):
        """Test POST /api/categories"""
        test_category = {
            "name": "Software Subscriptions",
            "type": "expense",
            "color": "#FF6B6B"
        }
        
        success, data, status_code = self.make_request("POST", "/categories", test_category)
        if success and 'id' in data:
            self.created_ids['categories'].append(data['id'])
            self.log_test("POST Categories", True, f"Created category with ID: {data['id']}")
            return data
        else:
            self.log_test("POST Categories", False, f"Status: {status_code}, Data: {data}")
            return None
    
    def test_categories_put(self, category_id: int):
        """Test PUT /api/categories/{id}"""
        updated_category = {
            "name": "Updated Software Subscriptions",
            "type": "expense",
            "color": "#FF8C8C"
        }
        
        success, data, status_code = self.make_request("PUT", f"/categories/{category_id}", updated_category)
        if success and data.get('name') == updated_category['name']:
            self.log_test("PUT Categories", True, f"Updated category ID: {category_id}")
            return data
        else:
            self.log_test("PUT Categories", False, f"Status: {status_code}, Data: {data}")
            return None
    
    def test_categories_delete(self, category_id: int):
        """Test DELETE /api/categories/{id}"""
        success, data, status_code = self.make_request("DELETE", f"/categories/{category_id}")
        if success:
            self.log_test("DELETE Categories", True, f"Deleted category ID: {category_id}")
            return True
        else:
            self.log_test("DELETE Categories", False, f"Status: {status_code}, Data: {data}")
            return False
    
    def test_categories_404(self):
        """Test 404 error handling for categories"""
        success, data, status_code = self.make_request("DELETE", "/categories/99999")
        # This should return 404 for non-existent category
        if status_code == 404:
            self.log_test("Categories 404 Handling", True, "Correctly returned 404 for non-existent category")
        else:
            self.log_test("Categories 404 Handling", False, f"Expected 404, got {status_code}")

    # === ACCOUNTS TESTS ===
    
    def test_accounts_get(self):
        """Test GET /api/accounts"""
        success, data, status_code = self.make_request("GET", "/accounts")
        if success and isinstance(data, list):
            self.log_test("GET Accounts", True, f"Retrieved {len(data)} accounts")
            return data
        else:
            self.log_test("GET Accounts", False, f"Status: {status_code}, Data: {data}")
            return []
    
    def test_accounts_post(self):
        """Test POST /api/accounts"""
        test_account = {
            "name": "Business Checking",
            "type": "checking",
            "balance": 15000.50,
            "lowBalanceThreshold": 1000.0
        }
        
        success, data, status_code = self.make_request("POST", "/accounts", test_account)
        if success and 'id' in data:
            self.created_ids['accounts'].append(data['id'])
            self.log_test("POST Accounts", True, f"Created account with ID: {data['id']}")
            return data
        else:
            self.log_test("POST Accounts", False, f"Status: {status_code}, Data: {data}")
            return None
    
    def test_accounts_put(self, account_id: int):
        """Test PUT /api/accounts/{id}"""
        updated_account = {
            "name": "Updated Business Checking",
            "type": "checking",
            "balance": 16000.75,
            "lowBalanceThreshold": 1200.0
        }
        
        success, data, status_code = self.make_request("PUT", f"/accounts/{account_id}", updated_account)
        if success and data.get('balance') == updated_account['balance']:
            self.log_test("PUT Accounts", True, f"Updated account ID: {account_id}")
            return data
        else:
            self.log_test("PUT Accounts", False, f"Status: {status_code}, Data: {data}")
            return None
    
    def test_accounts_delete(self, account_id: int):
        """Test DELETE /api/accounts/{id}"""
        success, data, status_code = self.make_request("DELETE", f"/accounts/{account_id}")
        if success:
            self.log_test("DELETE Accounts", True, f"Deleted account ID: {account_id}")
            return True
        else:
            self.log_test("DELETE Accounts", False, f"Status: {status_code}, Data: {data}")
            return False

    # === TRANSACTIONS TESTS ===
    
    def test_transactions_get(self):
        """Test GET /api/transactions"""
        success, data, status_code = self.make_request("GET", "/transactions")
        if success and isinstance(data, list):
            self.log_test("GET Transactions", True, f"Retrieved {len(data)} transactions")
            return data
        else:
            self.log_test("GET Transactions", False, f"Status: {status_code}, Data: {data}")
            return []
    
    def test_transactions_get_filtered(self):
        """Test GET /api/transactions with filters"""
        # Test type filter
        success, data, status_code = self.make_request("GET", "/transactions", params={"type": "income"})
        if success:
            self.log_test("GET Transactions (type filter)", True, f"Retrieved {len(data)} income transactions")
        else:
            self.log_test("GET Transactions (type filter)", False, f"Status: {status_code}")
        
        # Test status filter
        success, data, status_code = self.make_request("GET", "/transactions", params={"status": "completed"})
        if success:
            self.log_test("GET Transactions (status filter)", True, f"Retrieved {len(data)} completed transactions")
        else:
            self.log_test("GET Transactions (status filter)", False, f"Status: {status_code}")
        
        # Test search filter
        success, data, status_code = self.make_request("GET", "/transactions", params={"search": "office"})
        if success:
            self.log_test("GET Transactions (search filter)", True, f"Retrieved {len(data)} transactions matching 'office'")
        else:
            self.log_test("GET Transactions (search filter)", False, f"Status: {status_code}")
    
    def test_transactions_post(self, category_id: int, account_id: int, client_id: int = None):
        """Test POST /api/transactions"""
        test_transaction = {
            "date": "2024-01-15",
            "type": "expense",
            "amount": 299.99,
            "categoryId": category_id,
            "accountId": account_id,
            "clientVendorId": client_id,
            "status": "completed",
            "notes": "Monthly software license renewal",
            "recurring": True
        }
        
        success, data, status_code = self.make_request("POST", "/transactions", test_transaction)
        if success and 'id' in data:
            self.created_ids['transactions'].append(data['id'])
            self.log_test("POST Transactions", True, f"Created transaction with ID: {data['id']}")
            return data
        else:
            self.log_test("POST Transactions", False, f"Status: {status_code}, Data: {data}")
            return None
    
    def test_transactions_put(self, transaction_id: int, category_id: int, account_id: int):
        """Test PUT /api/transactions/{id}"""
        updated_transaction = {
            "date": "2024-01-16",
            "type": "expense",
            "amount": 349.99,
            "categoryId": category_id,
            "accountId": account_id,
            "status": "pending",
            "notes": "Updated software license renewal",
            "recurring": False
        }
        
        success, data, status_code = self.make_request("PUT", f"/transactions/{transaction_id}", updated_transaction)
        if success and data.get('amount') == updated_transaction['amount']:
            self.log_test("PUT Transactions", True, f"Updated transaction ID: {transaction_id}")
            return data
        else:
            self.log_test("PUT Transactions", False, f"Status: {status_code}, Data: {data}")
            return None
    
    def test_transactions_delete(self, transaction_id: int):
        """Test DELETE /api/transactions/{id}"""
        success, data, status_code = self.make_request("DELETE", f"/transactions/{transaction_id}")
        if success:
            self.log_test("DELETE Transactions", True, f"Deleted transaction ID: {transaction_id}")
            return True
        else:
            self.log_test("DELETE Transactions", False, f"Status: {status_code}, Data: {data}")
            return False

    # === CLIENTS TESTS ===
    
    def test_clients_get(self):
        """Test GET /api/clients"""
        success, data, status_code = self.make_request("GET", "/clients")
        if success and isinstance(data, list):
            self.log_test("GET Clients", True, f"Retrieved {len(data)} clients")
            return data
        else:
            self.log_test("GET Clients", False, f"Status: {status_code}, Data: {data}")
            return []
    
    def test_clients_post(self):
        """Test POST /api/clients"""
        test_client = {
            "name": "Acme Corporation",
            "email": "billing@acmecorp.com",
            "paymentTerms": "Net 30"
        }
        
        success, data, status_code = self.make_request("POST", "/clients", test_client)
        if success and 'id' in data:
            self.created_ids['clients'].append(data['id'])
            self.log_test("POST Clients", True, f"Created client with ID: {data['id']}")
            return data
        else:
            self.log_test("POST Clients", False, f"Status: {status_code}, Data: {data}")
            return None
    
    def test_clients_put(self, client_id: int):
        """Test PUT /api/clients/{id}"""
        updated_client = {
            "name": "Acme Corporation Ltd",
            "email": "accounts@acmecorp.com",
            "paymentTerms": "Net 15"
        }
        
        success, data, status_code = self.make_request("PUT", f"/clients/{client_id}", updated_client)
        if success and data.get('paymentTerms') == updated_client['paymentTerms']:
            self.log_test("PUT Clients", True, f"Updated client ID: {client_id}")
            return data
        else:
            self.log_test("PUT Clients", False, f"Status: {status_code}, Data: {data}")
            return None
    
    def test_clients_delete(self, client_id: int):
        """Test DELETE /api/clients/{id}"""
        success, data, status_code = self.make_request("DELETE", f"/clients/{client_id}")
        if success:
            self.log_test("DELETE Clients", True, f"Deleted client ID: {client_id}")
            return True
        else:
            self.log_test("DELETE Clients", False, f"Status: {status_code}, Data: {data}")
            return False

    # === VENDORS TESTS ===
    
    def test_vendors_get(self):
        """Test GET /api/vendors"""
        success, data, status_code = self.make_request("GET", "/vendors")
        if success and isinstance(data, list):
            self.log_test("GET Vendors", True, f"Retrieved {len(data)} vendors")
            return data
        else:
            self.log_test("GET Vendors", False, f"Status: {status_code}, Data: {data}")
            return []
    
    def test_vendors_post(self):
        """Test POST /api/vendors"""
        test_vendor = {
            "name": "Office Supply Co",
            "email": "orders@officesupply.com",
            "defaultCategory": "Office Supplies"
        }
        
        success, data, status_code = self.make_request("POST", "/vendors", test_vendor)
        if success and 'id' in data:
            self.created_ids['vendors'].append(data['id'])
            self.log_test("POST Vendors", True, f"Created vendor with ID: {data['id']}")
            return data
        else:
            self.log_test("POST Vendors", False, f"Status: {status_code}, Data: {data}")
            return None
    
    def test_vendors_put(self, vendor_id: int):
        """Test PUT /api/vendors/{id}"""
        updated_vendor = {
            "name": "Premium Office Supply Co",
            "email": "sales@premiumoffice.com",
            "defaultCategory": "Office Equipment"
        }
        
        success, data, status_code = self.make_request("PUT", f"/vendors/{vendor_id}", updated_vendor)
        if success and data.get('name') == updated_vendor['name']:
            self.log_test("PUT Vendors", True, f"Updated vendor ID: {vendor_id}")
            return data
        else:
            self.log_test("PUT Vendors", False, f"Status: {status_code}, Data: {data}")
            return None
    
    def test_vendors_delete(self, vendor_id: int):
        """Test DELETE /api/vendors/{id}"""
        success, data, status_code = self.make_request("DELETE", f"/vendors/{vendor_id}")
        if success:
            self.log_test("DELETE Vendors", True, f"Deleted vendor ID: {vendor_id}")
            return True
        else:
            self.log_test("DELETE Vendors", False, f"Status: {status_code}, Data: {data}")
            return False

    # === BUDGETS TESTS ===
    
    def test_budgets_get(self):
        """Test GET /api/budgets"""
        success, data, status_code = self.make_request("GET", "/budgets")
        if success and isinstance(data, list):
            self.log_test("GET Budgets", True, f"Retrieved {len(data)} budgets")
            return data
        else:
            self.log_test("GET Budgets", False, f"Status: {status_code}, Data: {data}")
            return []
    
    def test_budgets_post(self, category_id: int):
        """Test POST /api/budgets"""
        test_budget = {
            "categoryId": category_id,
            "monthlyBudget": 500.0
        }
        
        success, data, status_code = self.make_request("POST", "/budgets", test_budget)
        if success and 'categoryId' in data:
            self.created_ids['budgets'].append(data['categoryId'])
            self.log_test("POST Budgets", True, f"Created budget for category ID: {data['categoryId']}")
            return data
        else:
            self.log_test("POST Budgets", False, f"Status: {status_code}, Data: {data}")
            return None
    
    def test_budgets_put(self, category_id: int):
        """Test PUT /api/budgets/{categoryId}"""
        updated_budget = {
            "categoryId": category_id,
            "monthlyBudget": 750.0
        }
        
        success, data, status_code = self.make_request("PUT", f"/budgets/{category_id}", updated_budget)
        if success and data.get('monthlyBudget') == updated_budget['monthlyBudget']:
            self.log_test("PUT Budgets", True, f"Updated budget for category ID: {category_id}")
            return data
        else:
            self.log_test("PUT Budgets", False, f"Status: {status_code}, Data: {data}")
            return None
    
    def test_budgets_delete(self, category_id: int):
        """Test DELETE /api/budgets/{categoryId}"""
        success, data, status_code = self.make_request("DELETE", f"/budgets/{category_id}")
        if success:
            self.log_test("DELETE Budgets", True, f"Deleted budget for category ID: {category_id}")
            return True
        else:
            self.log_test("DELETE Budgets", False, f"Status: {status_code}, Data: {data}")
            return False

    # === DASHBOARD TESTS ===
    
    def test_dashboard_kpis(self):
        """Test GET /api/dashboard/kpis"""
        success, data, status_code = self.make_request("GET", "/dashboard/kpis")
        if success and isinstance(data, dict):
            required_fields = ['totalIncome', 'totalExpenses', 'balance', 'netProfit', 'pendingTransactions', 'overdueTransactions']
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields:
                self.log_test("GET Dashboard KPIs", True, f"Retrieved all KPI fields: {list(data.keys())}")
                return data
            else:
                self.log_test("GET Dashboard KPIs", False, f"Missing fields: {missing_fields}")
                return None
        else:
            self.log_test("GET Dashboard KPIs", False, f"Status: {status_code}, Data: {data}")
            return None

    # === MAIN TEST RUNNER ===
    
    def run_all_tests(self):
        """Run all API tests in sequence"""
        print(f"\n🚀 Starting Backend API Tests for Income & Expense Tracker")
        print(f"Base URL: {self.base_url}")
        print("=" * 80)
        
        # Test Categories
        print("\n📁 TESTING CATEGORIES API")
        categories = self.test_categories_get()
        new_category = self.test_categories_post()
        if new_category:
            self.test_categories_put(new_category['id'])
            self.test_categories_delete(new_category['id'])
        self.test_categories_404()
        
        # Test Accounts
        print("\n🏦 TESTING ACCOUNTS API")
        accounts = self.test_accounts_get()
        new_account = self.test_accounts_post()
        if new_account:
            self.test_accounts_put(new_account['id'])
            self.test_accounts_delete(new_account['id'])
        
        # Test Clients
        print("\n👥 TESTING CLIENTS API")
        clients = self.test_clients_get()
        new_client = self.test_clients_post()
        if new_client:
            self.test_clients_put(new_client['id'])
            # Don't delete client yet, we'll use it for transactions
        
        # Test Vendors
        print("\n🏢 TESTING VENDORS API")
        vendors = self.test_vendors_get()
        new_vendor = self.test_vendors_post()
        if new_vendor:
            self.test_vendors_put(new_vendor['id'])
            self.test_vendors_delete(new_vendor['id'])
        
        # Test Transactions (requires existing categories and accounts)
        print("\n💰 TESTING TRANSACTIONS API")
        transactions = self.test_transactions_get()
        self.test_transactions_get_filtered()
        
        # Use existing data for transaction tests
        if categories and accounts:
            category_id = categories[0]['id'] if categories else 1
            account_id = accounts[0]['id'] if accounts else 1
            client_id = new_client['id'] if new_client else None
            
            new_transaction = self.test_transactions_post(category_id, account_id, client_id)
            if new_transaction:
                self.test_transactions_put(new_transaction['id'], category_id, account_id)
                self.test_transactions_delete(new_transaction['id'])
        
        # Test Budgets (requires existing categories)
        print("\n📊 TESTING BUDGETS API")
        budgets = self.test_budgets_get()
        if categories:
            category_id = categories[0]['id'] if categories else 1
            new_budget = self.test_budgets_post(category_id)
            if new_budget:
                self.test_budgets_put(new_budget['categoryId'])
                self.test_budgets_delete(new_budget['categoryId'])
        
        # Test Dashboard
        print("\n📈 TESTING DASHBOARD API")
        self.test_dashboard_kpis()
        
        # Clean up remaining test data
        if new_client:
            self.test_clients_delete(new_client['id'])
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 80)
        print("📋 TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in self.test_results if result['success'])
        failed = len(self.test_results) - passed
        
        print(f"Total Tests: {len(self.test_results)}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"Success Rate: {(passed/len(self.test_results)*100):.1f}%")
        
        if failed > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['details']}")
        
        print("\n" + "=" * 80)
        return passed, failed

def main():
    """Main test execution"""
    tester = APITester(BASE_URL)
    tester.run_all_tests()
    
    # Return exit code based on test results
    passed, failed = tester.print_summary()
    sys.exit(0 if failed == 0 else 1)

if __name__ == "__main__":
    main()