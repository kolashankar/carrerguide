#!/usr/bin/env python3
"""
Backend API Testing for CareerGuide Admin Dashboard
Testing Priority 1: Roadmaps with Reading Time Auto-Calculation
Testing Priority 2: Sub-Admin Management (Super Admin Only)  
Testing Priority 3: DSA Companies Module
"""

import asyncio
import aiohttp
import json
import uuid
from typing import Dict, Any, Optional
import time

# Backend URL from environment
BACKEND_URL = "https://jobportal-dash-2.preview.emergentagent.com/api"

# Super Admin Credentials
SUPER_ADMIN_EMAIL = "kolashankar113@gmail.com"
SUPER_ADMIN_PASSWORD = "Shankar@113"

class BackendTester:
    def __init__(self):
        self.session = None
        self.admin_token = None
        self.test_results = []
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def log_result(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "response_data": response_data,
            "timestamp": time.time()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        if not success and response_data:
            print(f"   Response: {response_data}")
        print()

    async def setup_session(self):
        """Setup HTTP session"""
        self.session = aiohttp.ClientSession()

    async def cleanup_session(self):
        """Cleanup HTTP session"""
        if self.session:
            await self.session.close()

    async def make_request(self, method: str, endpoint: str, data: Dict = None, 
                          headers: Dict = None, params: Dict = None) -> Dict:
        """Make HTTP request to backend"""
        url = f"{BACKEND_URL}{endpoint}"
        
        default_headers = {"Content-Type": "application/json"}
        if headers:
            default_headers.update(headers)
            
        try:
            async with self.session.request(
                method, url, 
                json=data if data else None,
                headers=default_headers,
                params=params
            ) as response:
                response_text = await response.text()
                try:
                    response_data = json.loads(response_text) if response_text else {}
                except json.JSONDecodeError:
                    response_data = {"raw_response": response_text}
                
                return {
                    "status_code": response.status,
                    "data": response_data,
                    "success": 200 <= response.status < 300
                }
        except Exception as e:
            return {
                "status_code": 0,
                "data": {"error": str(e)},
                "success": False
            }

    def log_test_result(self, module: str, test_name: str, success: bool, 
                       details: str, response_data: Dict = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results[module].append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} [{module.upper()}] {test_name}: {details}")

    # =============================================================================
    # AUTHENTICATION SYSTEM TESTS
    # =============================================================================

    async def test_authentication_system(self):
        """Test complete authentication system"""
        print("\n🔐 TESTING AUTHENTICATION SYSTEM...")
        
        # Test 1: Admin Registration
        admin_data = {
            "email": f"admin_{uuid.uuid4().hex[:8]}@test.com",
            "username": f"admin_{uuid.uuid4().hex[:8]}",
            "password": "SecurePass123!",
            "full_name": "Test Admin User"
        }
        
        response = await self.make_request("POST", "/auth/admin/register", admin_data)
        success = response["success"] and response["data"].get("success", False)
        self.log_test_result("authentication", "Admin Registration", success,
                           f"Status: {response['status_code']}, Response: {response['data']}")
        
        if success:
            self.created_resources["admin_users"].append(admin_data["email"])

        # Test 2: Admin Login
        login_data = {"email": admin_data["email"], "password": admin_data["password"]}
        response = await self.make_request("POST", "/auth/admin/login", login_data)
        success = response["success"] and "token" in response["data"]
        
        if success:
            self.admin_token = response["data"]["token"]
            
        self.log_test_result("authentication", "Admin Login", success,
                           f"Status: {response['status_code']}, Token received: {'Yes' if success else 'No'}")

        # Test 3: User Registration
        user_data = {
            "email": f"user_{uuid.uuid4().hex[:8]}@test.com",
            "password": "UserPass123!",
            "full_name": "Test App User"
        }
        
        response = await self.make_request("POST", "/auth/user/register", user_data)
        success = response["success"] and response["data"].get("success", False)
        self.log_test_result("authentication", "User Registration", success,
                           f"Status: {response['status_code']}, Response: {response['data']}")
        
        if success:
            self.created_resources["app_users"].append(user_data["email"])

        # Test 4: User Login
        login_data = {"email": user_data["email"], "password": user_data["password"]}
        response = await self.make_request("POST", "/auth/user/login", login_data)
        success = response["success"] and "token" in response["data"]
        
        if success:
            self.user_token = response["data"]["token"]
            
        self.log_test_result("authentication", "User Login", success,
                           f"Status: {response['status_code']}, Token received: {'Yes' if success else 'No'}")

        # Test 5: Get Current User (with token)
        if self.user_token:
            headers = {"Authorization": f"Bearer {self.user_token}"}
            response = await self.make_request("GET", "/auth/me", headers=headers)
            success = response["success"] and "user" in response["data"]
            self.log_test_result("authentication", "Get Current User", success,
                               f"Status: {response['status_code']}, User data received: {'Yes' if success else 'No'}")

        # Test 6: Update Profile (auth required)
        if self.user_token:
            headers = {"Authorization": f"Bearer {self.user_token}"}
            update_data = {"full_name": "Updated Test User", "bio": "Updated bio"}
            response = await self.make_request("PUT", "/auth/profile", update_data, headers=headers)
            success = response["success"]
            self.log_test_result("authentication", "Update Profile", success,
                               f"Status: {response['status_code']}, Profile updated: {'Yes' if success else 'No'}")

        # Test 7: Change Password (auth required)
        if self.user_token:
            headers = {"Authorization": f"Bearer {self.user_token}"}
            password_data = {
                "old_password": user_data["password"],
                "new_password": "NewUserPass123!"
            }
            response = await self.make_request("POST", "/auth/change-password", password_data, headers=headers)
            success = response["success"]
            self.log_test_result("authentication", "Change Password", success,
                               f"Status: {response['status_code']}, Password changed: {'Yes' if success else 'No'}")

    # =============================================================================
    # DSA COMPANIES MODULE TESTS
    # =============================================================================

    async def test_dsa_companies_module(self):
        """Test DSA Companies CRUD operations and statistics"""
        print("\n🏢 TESTING DSA COMPANIES MODULE...")
        
        # Test 1: Create Company
        company_data = {
            "name": "Google Inc",
            "logo": "https://example.com/google-logo.png",
            "industry": "Technology",
            "website": "https://google.com",
            "description": "Leading technology company specializing in internet services and products"
        }
        
        response = await self.make_request("POST", "/admin/dsa/companies", company_data)
        success = response["success"] and response["data"].get("success", False)
        company_id = response["data"].get("company", {}).get("id") if success else None
        
        if company_id:
            self.created_resources["companies"].append(company_id)
            
        self.log_test_result("dsa_companies", "Create Company", success,
                           f"Status: {response['status_code']}, Company ID: {company_id}")

        # Test 2: Get All Companies (with filters)
        params = {"search": "Google", "industry": "Technology", "limit": 10}
        response = await self.make_request("GET", "/admin/dsa/companies", params=params)
        success = response["success"] and "companies" in response["data"]
        companies_count = len(response["data"].get("companies", [])) if success else 0
        
        self.log_test_result("dsa_companies", "List Companies with Filters", success,
                           f"Status: {response['status_code']}, Companies found: {companies_count}")

        # Test 3: Get Company Statistics
        response = await self.make_request("GET", "/admin/dsa/companies/stats")
        success = response["success"] and "total_companies" in response["data"]
        
        self.log_test_result("dsa_companies", "Get Company Statistics", success,
                           f"Status: {response['status_code']}, Stats available: {'Yes' if success else 'No'}")

        # Test 4: Get Top Companies
        params = {"limit": 10, "by": "problems"}
        response = await self.make_request("GET", "/admin/dsa/companies/top", params=params)
        success = response["success"] and "companies" in response["data"]
        
        self.log_test_result("dsa_companies", "Get Top Companies", success,
                           f"Status: {response['status_code']}, Top companies retrieved: {'Yes' if success else 'No'}")

        # Test 5: Get Single Company
        if company_id:
            response = await self.make_request("GET", f"/admin/dsa/companies/{company_id}")
            success = response["success"] and "company" in response["data"]
            
            self.log_test_result("dsa_companies", "Get Single Company", success,
                               f"Status: {response['status_code']}, Company retrieved: {'Yes' if success else 'No'}")

        # Test 6: Update Company
        if company_id:
            update_data = {
                "description": "Updated: Leading technology company with innovative solutions",
                "industry": "Technology & AI"
            }
            response = await self.make_request("PUT", f"/admin/dsa/companies/{company_id}", update_data)
            success = response["success"]
            
            self.log_test_result("dsa_companies", "Update Company", success,
                               f"Status: {response['status_code']}, Company updated: {'Yes' if success else 'No'}")

        # Test 7: Delete Company
        if company_id:
            response = await self.make_request("DELETE", f"/admin/dsa/companies/{company_id}")
            success = response["success"]
            
            self.log_test_result("dsa_companies", "Delete Company", success,
                               f"Status: {response['status_code']}, Company deleted: {'Yes' if success else 'No'}")

    # =============================================================================
    # ROADMAPS MODULE TESTS
    # =============================================================================

    async def test_roadmaps_module(self):
        """Test Roadmaps CRUD operations, AI generation, and node management"""
        print("\n🗺️ TESTING ROADMAPS MODULE...")
        
        # Test 1: Create Roadmap Manually
        roadmap_data = {
            "title": "Full Stack Developer Roadmap 2025",
            "description": "Complete roadmap for becoming a full stack developer",
            "category": "tech_roadmap",
            "subcategory": "full_stack",
            "difficulty_level": "beginner",
            "estimated_duration": "6 months",
            "nodes": [
                {
                    "id": str(uuid.uuid4()),
                    "title": "HTML Basics",
                    "description": "Learn HTML fundamentals",
                    "node_type": "content",
                    "position_x": 100,
                    "position_y": 100,
                    "is_completed": False,
                    "dependencies": []
                }
            ]
        }
        
        response = await self.make_request("POST", "/admin/roadmaps", roadmap_data)
        success = response["success"] and response["data"].get("success", False)
        roadmap_id = response["data"].get("roadmap", {}).get("id") if success else None
        
        if roadmap_id:
            self.created_resources["roadmaps"].append(roadmap_id)
            
        self.log_test_result("roadmaps", "Create Roadmap Manually", success,
                           f"Status: {response['status_code']}, Roadmap ID: {roadmap_id}")

        # Test 2: AI Generate Roadmap (15-25 nodes)
        ai_data = {
            "title": "Full Stack Developer 2025",
            "category": "tech_roadmap",
            "subcategory": "full_stack",
            "difficulty_level": "beginner"
        }
        
        response = await self.make_request("POST", "/admin/roadmaps/generate-ai", ai_data)
        success = response["success"] and response["data"].get("success", False)
        ai_roadmap_id = response["data"].get("roadmap", {}).get("id") if success else None
        nodes_count = len(response["data"].get("roadmap", {}).get("nodes", [])) if success else 0
        
        if ai_roadmap_id:
            self.created_resources["roadmaps"].append(ai_roadmap_id)
            
        # Verify 15-25 nodes were created
        nodes_valid = 15 <= nodes_count <= 25 if success else False
        
        self.log_test_result("roadmaps", "AI Generate Roadmap", success and nodes_valid,
                           f"Status: {response['status_code']}, Nodes created: {nodes_count}, Valid range (15-25): {'Yes' if nodes_valid else 'No'}")

        # Test 3: Get All Roadmaps (with filters)
        params = {"search": "Full Stack", "category": "tech_roadmap", "limit": 10}
        response = await self.make_request("GET", "/admin/roadmaps", params=params)
        success = response["success"] and "roadmaps" in response["data"]
        roadmaps_count = len(response["data"].get("roadmaps", [])) if success else 0
        
        self.log_test_result("roadmaps", "List Roadmaps with Filters", success,
                           f"Status: {response['status_code']}, Roadmaps found: {roadmaps_count}")

        # Test 4: Get Roadmap Statistics
        response = await self.make_request("GET", "/admin/roadmaps/stats")
        success = response["success"] and "total_roadmaps" in response["data"]
        
        self.log_test_result("roadmaps", "Get Roadmap Statistics", success,
                           f"Status: {response['status_code']}, Stats available: {'Yes' if success else 'No'}")

        # Test 5: Get Single Roadmap
        if roadmap_id:
            response = await self.make_request("GET", f"/admin/roadmaps/{roadmap_id}")
            success = response["success"] and "roadmap" in response["data"]
            
            self.log_test_result("roadmaps", "Get Single Roadmap", success,
                               f"Status: {response['status_code']}, Roadmap retrieved: {'Yes' if success else 'No'}")

        # Test 6: Update Roadmap
        if roadmap_id:
            update_data = {
                "description": "Updated: Complete roadmap for becoming a full stack developer in 2025",
                "estimated_duration": "8 months"
            }
            response = await self.make_request("PUT", f"/admin/roadmaps/{roadmap_id}", update_data)
            success = response["success"]
            
            self.log_test_result("roadmaps", "Update Roadmap", success,
                               f"Status: {response['status_code']}, Roadmap updated: {'Yes' if success else 'No'}")

        # Test 7: Toggle Publish Status
        if roadmap_id:
            response = await self.make_request("POST", f"/admin/roadmaps/{roadmap_id}/toggle-publish")
            success = response["success"]
            
            self.log_test_result("roadmaps", "Toggle Publish Status", success,
                               f"Status: {response['status_code']}, Publish toggled: {'Yes' if success else 'No'}")

        # Test 8: Add Node to Roadmap
        if roadmap_id:
            node_data = {
                "id": str(uuid.uuid4()),
                "title": "CSS Fundamentals",
                "description": "Learn CSS styling basics",
                "node_type": "content",
                "position_x": 200,
                "position_y": 100,
                "is_completed": False,
                "dependencies": []
            }
            response = await self.make_request("POST", f"/admin/roadmaps/{roadmap_id}/nodes", node_data)
            success = response["success"]
            
            self.log_test_result("roadmaps", "Add Node to Roadmap", success,
                               f"Status: {response['status_code']}, Node added: {'Yes' if success else 'No'}")

        # Test 9: Update Node in Roadmap
        if roadmap_id and roadmap_data["nodes"]:
            node_id = roadmap_data["nodes"][0]["id"]
            update_node_data = {
                "title": "Advanced HTML",
                "description": "Learn advanced HTML concepts and semantic markup"
            }
            response = await self.make_request("PUT", f"/admin/roadmaps/{roadmap_id}/nodes/{node_id}", update_node_data)
            success = response["success"]
            
            self.log_test_result("roadmaps", "Update Node in Roadmap", success,
                               f"Status: {response['status_code']}, Node updated: {'Yes' if success else 'No'}")

        # Test 10: Delete Node from Roadmap
        if roadmap_id and roadmap_data["nodes"]:
            node_id = roadmap_data["nodes"][0]["id"]
            response = await self.make_request("DELETE", f"/admin/roadmaps/{roadmap_id}/nodes/{node_id}")
            success = response["success"]
            
            self.log_test_result("roadmaps", "Delete Node from Roadmap", success,
                               f"Status: {response['status_code']}, Node deleted: {'Yes' if success else 'No'}")

        # Test 11: Delete Roadmap
        if roadmap_id:
            response = await self.make_request("DELETE", f"/admin/roadmaps/{roadmap_id}")
            success = response["success"]
            
            self.log_test_result("roadmaps", "Delete Roadmap", success,
                               f"Status: {response['status_code']}, Roadmap deleted: {'Yes' if success else 'No'}")

    # =============================================================================
    # CAREER TOOLS MODULE TESTS (Auth Required)
    # =============================================================================

    async def test_career_tools_module(self):
        """Test Career Tools AI-powered features with authentication"""
        print("\n🛠️ TESTING CAREER TOOLS MODULE...")
        
        if not self.user_token:
            self.log_test_result("career_tools", "Authentication Check", False,
                               "No user token available - skipping career tools tests")
            return

        headers = {"Authorization": f"Bearer {self.user_token}"}

        # Test 1: Resume Review
        resume_data = {
            "resume_text": "John Doe\nSoftware Engineer\n\nExperience:\n- 3 years at Tech Corp\n- Developed web applications using React and Node.js\n- Led team of 5 developers\n\nSkills:\n- JavaScript, Python, React, Node.js\n- AWS, Docker, Kubernetes\n- Agile methodologies",
            "target_role": "Senior Software Engineer",
            "industry": "Technology"
        }
        
        response = await self.make_request("POST", "/career-tools/resume-review", resume_data, headers=headers)
        success = response["success"] and "review" in response["data"]
        
        self.log_test_result("career_tools", "Resume Review", success,
                           f"Status: {response['status_code']}, Review generated: {'Yes' if success else 'No'}")

        # Test 2: Cover Letter Generation
        cover_letter_data = {
            "job_title": "Senior Software Engineer",
            "company_name": "Google",
            "tone": "professional"
        }
        
        response = await self.make_request("POST", "/career-tools/cover-letter", cover_letter_data, headers=headers)
        success = response["success"] and "cover_letter" in response["data"]
        
        self.log_test_result("career_tools", "Cover Letter Generation", success,
                           f"Status: {response['status_code']}, Cover letter generated: {'Yes' if success else 'No'}")

        # Test 3: ATS Optimization
        ats_data = {
            "resume_text": "John Doe\nSoftware Engineer with 3 years experience in web development",
            "job_description": "We are looking for a Senior Software Engineer with experience in React, Node.js, and cloud technologies. Must have 3+ years experience and leadership skills."
        }
        
        response = await self.make_request("POST", "/career-tools/ats-hack", ats_data, headers=headers)
        success = response["success"] and "optimized_resume" in response["data"]
        
        self.log_test_result("career_tools", "ATS Optimization", success,
                           f"Status: {response['status_code']}, ATS optimization generated: {'Yes' if success else 'No'}")

        # Test 4: Cold Email Generation
        cold_email_data = {
            "company_name": "Google",
            "purpose": "job_inquiry",
            "tone": "professional"
        }
        
        response = await self.make_request("POST", "/career-tools/cold-email", cold_email_data, headers=headers)
        success = response["success"] and "cold_email" in response["data"]
        
        self.log_test_result("career_tools", "Cold Email Generation", success,
                           f"Status: {response['status_code']}, Cold email generated: {'Yes' if success else 'No'}")

        # Test 5: Get User Usage History
        response = await self.make_request("GET", "/career-tools/my-usage", headers=headers)
        success = response["success"] and "usage_history" in response["data"]
        
        self.log_test_result("career_tools", "Get Usage History", success,
                           f"Status: {response['status_code']}, Usage history retrieved: {'Yes' if success else 'No'}")

        # Test 6: Test without authentication (should fail)
        response = await self.make_request("POST", "/career-tools/resume-review", resume_data)
        success = not response["success"] and response["status_code"] == 401
        
        self.log_test_result("career_tools", "Authentication Required Check", success,
                           f"Status: {response['status_code']}, Properly blocked without auth: {'Yes' if success else 'No'}")

        # Admin Career Tools Tests (if admin token available)
        if self.admin_token:
            admin_headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Test 7: Create Prompt Template (Admin)
            template_data = {
                "tool_type": "resume_review",
                "template_name": "Technical Resume Review",
                "prompt_template": "Review this technical resume for {target_role} position: {resume_text}",
                "is_active": True
            }
            
            response = await self.make_request("POST", "/admin/career-tools/templates", template_data, headers=admin_headers)
            success = response["success"]
            template_id = response["data"].get("template", {}).get("id") if success else None
            
            self.log_test_result("career_tools", "Create Prompt Template (Admin)", success,
                               f"Status: {response['status_code']}, Template created: {'Yes' if success else 'No'}")

            # Test 8: Get All Templates (Admin)
            response = await self.make_request("GET", "/admin/career-tools/templates", headers=admin_headers)
            success = response["success"] and "templates" in response["data"]
            
            self.log_test_result("career_tools", "Get All Templates (Admin)", success,
                               f"Status: {response['status_code']}, Templates retrieved: {'Yes' if success else 'No'}")

            # Test 9: Update Template (Admin)
            if template_id:
                update_template_data = {
                    "template_name": "Advanced Technical Resume Review",
                    "is_active": True
                }
                response = await self.make_request("PUT", f"/admin/career-tools/templates/{template_id}", 
                                                 update_template_data, headers=admin_headers)
                success = response["success"]
                
                self.log_test_result("career_tools", "Update Template (Admin)", success,
                                   f"Status: {response['status_code']}, Template updated: {'Yes' if success else 'No'}")

            # Test 10: Get Usage Statistics (Admin)
            response = await self.make_request("GET", "/admin/career-tools/stats", headers=admin_headers)
            success = response["success"] and "total_usage" in response["data"]
            
            self.log_test_result("career_tools", "Get Usage Statistics (Admin)", success,
                               f"Status: {response['status_code']}, Stats retrieved: {'Yes' if success else 'No'}")

            # Test 11: Delete Template (Admin)
            if template_id:
                response = await self.make_request("DELETE", f"/admin/career-tools/templates/{template_id}", 
                                                 headers=admin_headers)
                success = response["success"]
                
                self.log_test_result("career_tools", "Delete Template (Admin)", success,
                                   f"Status: {response['status_code']}, Template deleted: {'Yes' if success else 'No'}")

    # =============================================================================
    # MAIN TEST RUNNER
    # =============================================================================

    async def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 STARTING COMPREHENSIVE BACKEND TESTING...")
        print(f"Backend URL: {BACKEND_URL}")
        print("=" * 80)
        
        await self.setup_session()
        
        try:
            # Test all modules
            await self.test_authentication_system()
            await self.test_dsa_companies_module()
            await self.test_roadmaps_module()
            await self.test_career_tools_module()
            
            # Print summary
            self.print_test_summary()
            
        except Exception as e:
            print(f"❌ CRITICAL ERROR during testing: {str(e)}")
        finally:
            await self.cleanup_session()

    def print_test_summary(self):
        """Print comprehensive test summary"""
        print("\n" + "=" * 80)
        print("📊 COMPREHENSIVE TEST SUMMARY")
        print("=" * 80)
        
        total_tests = 0
        total_passed = 0
        
        for module, tests in self.test_results.items():
            if not tests:
                continue
                
            module_passed = sum(1 for test in tests if test["success"])
            module_total = len(tests)
            total_tests += module_total
            total_passed += module_passed
            
            print(f"\n🔹 {module.upper().replace('_', ' ')} MODULE:")
            print(f"   Passed: {module_passed}/{module_total} ({(module_passed/module_total*100):.1f}%)")
            
            # Show failed tests
            failed_tests = [test for test in tests if not test["success"]]
            if failed_tests:
                print("   ❌ Failed Tests:")
                for test in failed_tests:
                    print(f"      - {test['test']}: {test['details']}")
        
        print(f"\n🎯 OVERALL RESULTS:")
        print(f"   Total Tests: {total_tests}")
        print(f"   Passed: {total_passed}")
        print(f"   Failed: {total_tests - total_passed}")
        print(f"   Success Rate: {(total_passed/total_tests*100):.1f}%" if total_tests > 0 else "   Success Rate: 0%")
        
        if total_passed == total_tests:
            print("\n🎉 ALL TESTS PASSED! Backend is fully functional.")
        else:
            print(f"\n⚠️  {total_tests - total_passed} tests failed. Review failed tests above.")

async def main():
    """Main test runner"""
    tester = BackendTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())