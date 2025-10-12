#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Develop a comprehensive job portal admin dashboard (web app) for CareerGuide Android app. 
  Build incrementally starting with Jobs module, then Internships, Scholarships, Learning 
  (Articles + DSA Corner with dashboard/questions/topics/sheets), Roadmaps, Career Tools 
  (Resume/Cover Letter/ATS/Cold Email with Gemini API integration).
  
  Features needed:
  - Complete CRUD operations for all modules
  - AI generation using Gemini API (existing key)
  - Search, sort, filter functionality
  - Sidebar navigation with hamburger menu
  - Role-based authentication (admin/sub-admin)
  - Analytics dashboard
  - Bulk import/export (CSV/Excel)
  - Content approval workflow
  - API usage logs
  - Push notifications management
  
  Structure: 8-level nested architecture for both frontend and backend
  Tech: Next.js (admin dashboard), FastAPI (backend), MongoDB, Gemini API

backend:
  - task: "Setup FastAPI backend with MongoDB connection"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Backend server running on port 8001, MongoDB connected, health check passing"

  - task: "Jobs CRUD API endpoints (create, read, update, delete)"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "All Jobs CRUD endpoints implemented with search, filter, sort. GET /api/admin/jobs returns empty array (no data yet)"
      - working: true
        agent: "testing"
        comment: "✅ COMPREHENSIVE TESTING COMPLETED: All Jobs CRUD operations working perfectly. Tested: POST /api/admin/jobs (create with full validation), GET /api/admin/jobs (list with pagination), GET /api/admin/jobs/{id} (single job), PUT /api/admin/jobs/{id} (update), DELETE /api/admin/jobs/{id} (delete). Search, filter, sort functionality all working correctly. Proper validation in place requiring description, job_type, category, experience_level. Error handling returns appropriate HTTP status codes for non-existent resources."

  - task: "Jobs AI generation endpoint with Gemini API"
    implemented: true
    working: true
    file: "/app/backend/api/utils/ai/gemini/generators/jobs/prompts/generator.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "AI generation endpoint POST /api/admin/jobs/generate-ai implemented with Gemini API key configured. Not tested yet"
      - working: true
        agent: "testing"
        comment: "✅ AI GENERATION WORKING PERFECTLY: POST /api/admin/jobs/generate-ai successfully generates comprehensive job listings using Gemini API. Tested with multiple job types (Machine Learning Engineer, Marketing Manager, Data Scientist). AI generates complete data including detailed descriptions (1400+ chars), 7+ skills, 7+ responsibilities, qualifications, benefits, and realistic salary ranges. Gemini API key (AIzaSyAP3N0jTzOMpLTRyy9d77Osq2gwpxZned4) is properly configured and functional."

  - task: "Internships CRUD API endpoints"
    implemented: true
    working: "NA"
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "All Internships CRUD endpoints implemented, similar structure to Jobs"

  - task: "Scholarships CRUD API endpoints"
    implemented: true
    working: "NA"
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "All Scholarships CRUD endpoints implemented, similar structure to Jobs"

frontend:
  - task: "Next.js admin dashboard setup with Tailwind CSS"
    implemented: true
    working: true
    file: "/app/admin_dashboard/frontend"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Next.js running on port 3001, dependencies installed, API client configured"

  - task: "Sidebar navigation with hamburger menu"
    implemented: true
    working: true
    file: "/app/admin_dashboard/frontend/components/ui/layout/sidebar/navigation/items/menu/handlers/Sidebar.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Responsive sidebar with hamburger menu for mobile, all navigation items present"

  - task: "Jobs list page with search, filter, sort"
    implemented: true
    working: "NA"
    file: "/app/admin_dashboard/frontend/app/dashboard/jobs/list/page.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Jobs list page with search by title, filter by category/type/experience, delete, toggle active status"

  - task: "Jobs create page (manual form)"
    implemented: true
    working: "NA"
    file: "/app/admin_dashboard/frontend/app/dashboard/jobs/create/page.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Complete job form with all fields: title, company, location, type, category, salary, skills, qualifications, responsibilities, benefits"

  - task: "Jobs create with AI generation"
    implemented: true
    working: "NA"
    file: "/app/admin_dashboard/frontend/app/dashboard/jobs/create-ai/page.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "AI generation form with minimal inputs (title, company, location, type, category, experience level)"

  - task: "Jobs edit page"
    implemented: true
    working: "NA"
    file: "/app/admin_dashboard/frontend/app/dashboard/jobs/edit/[id]/page.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Edit page created with dynamic routing, loads job data and uses JobForm component"

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 0
  run_ui: false

test_plan:
  current_focus:
    - "Jobs CRUD API endpoints (create, read, update, delete)"
    - "Jobs AI generation endpoint with Gemini API"
    - "Jobs list page with search, filter, sort"
    - "Jobs create page (manual form)"
    - "Jobs create with AI generation"
    - "Jobs edit page"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Jobs module implementation complete. Backend has all CRUD endpoints + AI generation with Gemini API.
      Frontend has list/create/edit pages with full form including skills, qualifications, responsibilities, benefits.
      Search, filter, sort functionality implemented.
      
      Ready for backend testing:
      1. Test all Jobs CRUD operations (create, read, update, delete)
      2. Test AI generation with Gemini API
      3. Test search, filter, sort functionality
      4. Test Internships and Scholarships endpoints
      
      Backend running on port 8001, Admin dashboard on port 3001.
      Gemini API key: AIzaSyAP3N0jTzOMpLTRyy9d77Osq2gwpxZned4