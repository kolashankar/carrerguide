from fastapi import FastAPI, APIRouter, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import Optional

# Import models
from api.models.schemas.jobs.fields.validators.custom.job_model import JobCreate, JobUpdate, JobResponse
from api.models.schemas.internships.fields.validators.custom.internship_model import InternshipCreate, InternshipUpdate, InternshipResponse
from api.models.schemas.scholarships.fields.validators.custom.scholarship_model import ScholarshipCreate, ScholarshipUpdate, ScholarshipResponse

# Import handlers
from api.routes.admin.jobs.management.crud.operations.handlers.job_handlers import JobHandlers
from api.routes.admin.internships.management.crud.operations.handlers.internship_handlers import InternshipHandlers
from api.routes.admin.scholarships.management.crud.operations.handlers.scholarship_handlers import ScholarshipHandlers

# Import AI generator
from api.utils.ai.gemini.generators.jobs.prompts.generator import GeminiJobGenerator

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize handlers
job_handlers = JobHandlers(db)
internship_handlers = InternshipHandlers(db)
scholarship_handlers = ScholarshipHandlers(db)

# Initialize Gemini AI
gemini_api_key = os.environ.get('GEMINI_API_KEY')
gemini_generator = GeminiJobGenerator(gemini_api_key) if gemini_api_key else None

# Create the main app without a prefix
app = FastAPI(title="CareerGuide API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# =============================================================================
# ADMIN ROUTES - JOBS
# =============================================================================

@api_router.post("/admin/jobs", response_model=dict, tags=["Admin - Jobs"])
async def create_job(job: JobCreate):
    """Create a new job listing manually"""
    return await job_handlers.create_job(job.dict())

@api_router.post("/admin/jobs/generate-ai", response_model=dict, tags=["Admin - Jobs"])
async def generate_job_with_ai(
    job_title: str = Query(..., description="Job title"),
    company: str = Query(..., description="Company name"),
    location: str = Query(..., description="Job location"),
    job_type: str = Query(default="full-time", description="Job type"),
    category: str = Query(default="technology", description="Job category"),
    experience_level: str = Query(default="mid", description="Experience level")
):
    """Generate a job listing using Gemini AI"""
    if not gemini_generator:
        return {"error": "Gemini API not configured"}
    
    prompt_data = {
        "job_title": job_title,
        "company": company,
        "location": location,
        "job_type": job_type,
        "category": category,
        "experience_level": experience_level
    }
    
    generated_job = await gemini_generator.generate_job_listing(prompt_data)
    return await job_handlers.create_job(generated_job)

@api_router.get("/admin/jobs", tags=["Admin - Jobs"])
async def get_all_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    job_type: Optional[str] = Query(None),
    experience_level: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: int = Query(-1, ge=-1, le=1)
):
    """Get all jobs with filtering, searching, and sorting"""
    return await job_handlers.get_all_jobs(
        skip=skip,
        limit=limit,
        search=search,
        category=category,
        job_type=job_type,
        experience_level=experience_level,
        is_active=is_active,
        sort_by=sort_by,
        sort_order=sort_order
    )

@api_router.get("/admin/jobs/{job_id}", tags=["Admin - Jobs"])
async def get_job(job_id: str):
    """Get a specific job by ID"""
    return await job_handlers.get_job_by_id(job_id)

@api_router.put("/admin/jobs/{job_id}", tags=["Admin - Jobs"])
async def update_job(job_id: str, job: JobUpdate):
    """Update a job listing"""
    return await job_handlers.update_job(job_id, job.dict(exclude_unset=True))

@api_router.delete("/admin/jobs/{job_id}", tags=["Admin - Jobs"])
async def delete_job(job_id: str):
    """Delete a job listing"""
    return await job_handlers.delete_job(job_id)

# =============================================================================
# ADMIN ROUTES - INTERNSHIPS
# =============================================================================

@api_router.post("/admin/internships", response_model=dict, tags=["Admin - Internships"])
async def create_internship(internship: InternshipCreate):
    """Create a new internship listing manually"""
    return await internship_handlers.create_internship(internship.dict())

@api_router.post("/admin/internships/generate-ai", response_model=dict, tags=["Admin - Internships"])
async def generate_internship_with_ai(
    title: str = Query(...),
    company: str = Query(...),
    location: str = Query(...),
    duration: str = Query(default="3 months"),
    category: str = Query(default="technology")
):
    """Generate an internship listing using Gemini AI"""
    if not gemini_generator:
        return {"error": "Gemini API not configured"}
    
    prompt_data = {
        "title": title,
        "company": company,
        "location": location,
        "duration": duration,
        "category": category
    }
    
    generated_internship = await gemini_generator.generate_internship_listing(prompt_data)
    return await internship_handlers.create_internship(generated_internship)

@api_router.get("/admin/internships", tags=["Admin - Internships"])
async def get_all_internships(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    internship_type: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: int = Query(-1, ge=-1, le=1)
):
    """Get all internships with filtering and sorting"""
    return await internship_handlers.get_all_internships(
        skip=skip,
        limit=limit,
        search=search,
        category=category,
        internship_type=internship_type,
        is_active=is_active,
        sort_by=sort_by,
        sort_order=sort_order
    )

@api_router.get("/admin/internships/{internship_id}", tags=["Admin - Internships"])
async def get_internship(internship_id: str):
    """Get a specific internship by ID"""
    return await internship_handlers.get_internship_by_id(internship_id)

@api_router.put("/admin/internships/{internship_id}", tags=["Admin - Internships"])
async def update_internship(internship_id: str, internship: InternshipUpdate):
    """Update an internship listing"""
    return await internship_handlers.update_internship(internship_id, internship.dict(exclude_unset=True))

@api_router.delete("/admin/internships/{internship_id}", tags=["Admin - Internships"])
async def delete_internship(internship_id: str):
    """Delete an internship listing"""
    return await internship_handlers.delete_internship(internship_id)

# =============================================================================
# ADMIN ROUTES - SCHOLARSHIPS
# =============================================================================

@api_router.post("/admin/scholarships", response_model=dict, tags=["Admin - Scholarships"])
async def create_scholarship(scholarship: ScholarshipCreate):
    """Create a new scholarship listing manually"""
    return await scholarship_handlers.create_scholarship(scholarship.dict())

@api_router.post("/admin/scholarships/generate-ai", response_model=dict, tags=["Admin - Scholarships"])
async def generate_scholarship_with_ai(
    title: str = Query(...),
    provider: str = Query(...),
    country: str = Query(...),
    education_level: str = Query(default="undergraduate")
):
    """Generate a scholarship listing using Gemini AI"""
    if not gemini_generator:
        return {"error": "Gemini API not configured"}
    
    prompt_data = {
        "title": title,
        "provider": provider,
        "country": country,
        "education_level": education_level
    }
    
    generated_scholarship = await gemini_generator.generate_scholarship_listing(prompt_data)
    return await scholarship_handlers.create_scholarship(generated_scholarship)

@api_router.get("/admin/scholarships", tags=["Admin - Scholarships"])
async def get_all_scholarships(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = Query(None),
    scholarship_type: Optional[str] = Query(None),
    education_level: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: int = Query(-1, ge=-1, le=1)
):
    """Get all scholarships with filtering and sorting"""
    return await scholarship_handlers.get_all_scholarships(
        skip=skip,
        limit=limit,
        search=search,
        scholarship_type=scholarship_type,
        education_level=education_level,
        country=country,
        is_active=is_active,
        sort_by=sort_by,
        sort_order=sort_order
    )

@api_router.get("/admin/scholarships/{scholarship_id}", tags=["Admin - Scholarships"])
async def get_scholarship(scholarship_id: str):
    """Get a specific scholarship by ID"""
    return await scholarship_handlers.get_scholarship_by_id(scholarship_id)

@api_router.put("/admin/scholarships/{scholarship_id}", tags=["Admin - Scholarships"])
async def update_scholarship(scholarship_id: str, scholarship: ScholarshipUpdate):
    """Update a scholarship listing"""
    return await scholarship_handlers.update_scholarship(scholarship_id, scholarship.dict(exclude_unset=True))

@api_router.delete("/admin/scholarships/{scholarship_id}", tags=["Admin - Scholarships"])
async def delete_scholarship(scholarship_id: str):
    """Delete a scholarship listing"""
    return await scholarship_handlers.delete_scholarship(scholarship_id)

# =============================================================================
# USER ROUTES - JOBS (Public facing)
# =============================================================================

@api_router.get("/user/jobs", tags=["User - Jobs"])
async def get_user_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    job_type: Optional[str] = Query(None),
    experience_level: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: int = Query(-1)
):
    """Public endpoint for users to browse active jobs"""
    return await job_handlers.get_all_jobs(
        skip=skip,
        limit=limit,
        search=search,
        category=category,
        job_type=job_type,
        experience_level=experience_level,
        is_active=True,  # Only show active jobs
        sort_by=sort_by,
        sort_order=sort_order
    )

@api_router.get("/user/jobs/{job_id}", tags=["User - Jobs"])
async def get_user_job(job_id: str):
    """Public endpoint to get a specific job"""
    return await job_handlers.get_job_by_id(job_id)

@api_router.get("/user/internships", tags=["User - Internships"])
async def get_user_internships(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    internship_type: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: int = Query(-1)
):
    """Public endpoint for users to browse active internships"""
    return await internship_handlers.get_all_internships(
        skip=skip,
        limit=limit,
        search=search,
        category=category,
        internship_type=internship_type,
        is_active=True,
        sort_by=sort_by,
        sort_order=sort_order
    )

@api_router.get("/user/scholarships", tags=["User - Scholarships"])
async def get_user_scholarships(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    scholarship_type: Optional[str] = Query(None),
    education_level: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: int = Query(-1)
):
    """Public endpoint for users to browse active scholarships"""
    return await scholarship_handlers.get_all_scholarships(
        skip=skip,
        limit=limit,
        search=search,
        scholarship_type=scholarship_type,
        education_level=education_level,
        country=country,
        is_active=True,
        sort_by=sort_by,
        sort_order=sort_order
    )

# =============================================================================
# Health Check
# =============================================================================

@api_router.get("/", tags=["Health"])
async def root():
    return {
        "message": "CareerGuide API",
        "version": "1.0.0",
        "status": "operational"
    }

@api_router.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "gemini_ai": "configured" if gemini_generator else "not configured"
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
