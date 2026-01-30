from fastapi import FastAPI, File, UploadFile, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
import uvicorn
from services import generate_content_for_all_platforms, generate_content, post_to_n8n

app = FastAPI(title="CampaignForge API", version="1.0.0")

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request validation
class ClientOnboardingRequest(BaseModel):
    brand_tone: str
    industry: str
    target_audience: str
    past_examples: Optional[str] = None
    company_name: str
    website_url: Optional[str] = None
    social_media_handles: Optional[str] = None
    marketing_goals: Optional[str] = None
    content_preferences: Optional[str] = None
    budget_range: Optional[str] = None
    primary_channels: Optional[str] = None

# Store client data (in production, use a database)
clients_db = []
content_db = []  # Store generated content
campaigns_db = []  # Store campaigns

@app.get("/")
async def root():
    return {"message": "Welcome to CampaignForge API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/client/onboard")
async def onboard_client(
    brand_tone: str = Form(...),
    industry: str = Form(...),
    target_audience: str = Form(...),
    past_examples: Optional[str] = Form(None),
    company_name: str = Form(...),
    website_url: Optional[str] = Form(None),
    social_media_handles: Optional[str] = Form(None),
    marketing_goals: Optional[str] = Form(None),
    content_preferences: Optional[str] = Form(None),
    budget_range: Optional[str] = Form(None),
    primary_channels: Optional[str] = Form(None),
    texts: Optional[str] = Form(None),
    images: List[UploadFile] = File(None),
    videos: List[UploadFile] = File(None)
):
    """
    Client onboarding endpoint that accepts form data including file uploads
    """
    try:
        # Process uploaded images
        image_files = []
        if images:
            for image in images:
                if image.filename:
                    contents = await image.read()
                    image_files.append({
                        "filename": image.filename,
                        "content_type": image.content_type,
                        "size": len(contents)
                    })
        
        # Process uploaded videos
        video_files = []
        if videos:
            for video in videos:
                if video.filename:
                    contents = await video.read()
                    video_files.append({
                        "filename": video.filename,
                        "content_type": video.content_type,
                        "size": len(contents)
                    })
        
        # Create client record
        client_data = {
            "client_id": f"CLIENT_{len(clients_db) + 1:04d}",
            "company_name": company_name,
            "brand_tone": brand_tone,
            "industry": industry,
            "target_audience": target_audience,
            "past_examples": past_examples,
            "website_url": website_url,
            "social_media_handles": social_media_handles,
            "marketing_goals": marketing_goals,
            "content_preferences": content_preferences,
            "budget_range": budget_range,
            "primary_channels": primary_channels,
            "texts": texts,
            "images": image_files,
            "videos": video_files,
            "onboarded_at": datetime.now().isoformat(),
            "status": "onboarded"
        }
        
        clients_db.append(client_data)
        
        # Generate initial content for all platforms
        try:
            generated_content = generate_content_for_all_platforms(client_data)
            for content_item in generated_content:
                content_item['id'] = f"CONTENT_{len(content_db) + 1:04d}"
                content_item['created_at'] = datetime.now().isoformat()
                content_db.append(content_item)
        except Exception as e:
            print(f"Warning: Could not generate initial content: {str(e)}")
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Client onboarded successfully",
                "client_id": client_data["client_id"],
                "data": client_data
            }
        )
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": f"Error onboarding client: {str(e)}"
            }
        )

@app.get("/api/clients")
async def get_clients():
    """Get all onboarded clients"""
    return {
        "success": True,
        "count": len(clients_db),
        "clients": clients_db
    }

@app.get("/api/client/{client_id}")
async def get_client(client_id: str):
    """Get specific client by ID"""
    client = next((c for c in clients_db if c["client_id"] == client_id), None)
    if client:
        return {"success": True, "client": client}
    return JSONResponse(
        status_code=404,
        content={"success": False, "message": "Client not found"}
    )

# Content Management Endpoints
@app.get("/api/content/pending")
async def get_pending_content(client_id: Optional[str] = Query(None)):
    """Get all pending content for approval"""
    pending = [c for c in content_db if c.get('status') == 'pending']
    if client_id:
        pending = [c for c in pending if c.get('client_id') == client_id]
    return {
        "success": True,
        "count": len(pending),
        "content": pending
    }

@app.post("/api/content/{content_id}/approve")
async def approve_content_endpoint(content_id: str):
    """Approve content and post to n8n"""
    content = next((c for c in content_db if c.get('id') == content_id), None)
    if not content:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Content not found"}
        )
    
    # Update status
    content['status'] = 'approved'
    content['approved_at'] = datetime.now().isoformat()
    
    # Get client data
    client = next((c for c in clients_db if c["client_id"] == content.get('client_id')), None)
    
    # Post to n8n
    if client:
        n8n_result = post_to_n8n(
            platform=content.get('platform'),
            content=content.get('content'),
            client_data=client
        )
        content['n8n_result'] = n8n_result
    
    return {
        "success": True,
        "message": "Content approved and posted",
        "data": content
    }

@app.put("/api/content/{content_id}/edit")
async def edit_content_endpoint(content_id: str, request: dict):
    """Edit content"""
    content = next((c for c in content_db if c.get('id') == content_id), None)
    if not content:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Content not found"}
        )
    
    content['content'] = request.get('content', content['content'])
    content['edited_at'] = datetime.now().isoformat()
    
    return {
        "success": True,
        "message": "Content updated",
        "data": content
    }

@app.delete("/api/content/{content_id}")
async def delete_content_endpoint(content_id: str):
    """Delete content"""
    global content_db
    content_db = [c for c in content_db if c.get('id') != content_id]
    return {
        "success": True,
        "message": "Content deleted"
    }

@app.post("/api/content/{content_id}/regenerate")
async def regenerate_content_endpoint(content_id: str, request: dict):
    """Regenerate content"""
    content = next((c for c in content_db if c.get('id') == content_id), None)
    if not content:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Content not found"}
        )
    
    client = next((c for c in clients_db if c["client_id"] == content.get('client_id')), None)
    if not client:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Client not found"}
        )
    
    try:
        new_content = generate_content(
            client_data=client,
            platform=request.get('platform', content.get('platform')),
            content_type=request.get('content_type', content.get('content_type'))
        )
        
        content['content'] = new_content
        content['regenerated_at'] = datetime.now().isoformat()
        
        return {
            "success": True,
            "message": "Content regenerated",
            "data": content
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error regenerating content: {str(e)}"}
        )

# Analytics Endpoints
@app.get("/api/analytics")
async def get_analytics(time_range: str = Query("7d")):
    """Get analytics data"""
    # Sample analytics data
    return {
        "success": True,
        "time_range": time_range,
        "performance_over_time": [
            {"date": "Mon", "views": 1200, "engagement": 450, "clicks": 320},
            {"date": "Tue", "views": 1900, "engagement": 680, "clicks": 510},
            {"date": "Wed", "views": 3000, "engagement": 920, "clicks": 720},
            {"date": "Thu", "views": 2780, "engagement": 850, "clicks": 680},
            {"date": "Fri", "views": 3890, "engagement": 1200, "clicks": 950},
            {"date": "Sat", "views": 2390, "engagement": 750, "clicks": 590},
            {"date": "Sun", "views": 3490, "engagement": 1100, "clicks": 890}
        ],
        "platform_performance": [
            {"name": "LinkedIn", "value": 35, "posts": 120},
            {"name": "Twitter", "value": 25, "posts": 85},
            {"name": "Instagram", "value": 20, "posts": 95},
            {"name": "Facebook", "value": 15, "posts": 70},
            {"name": "Email", "value": 5, "posts": 30}
        ],
        "campaign_performance": [
            {"name": "Campaign A", "impressions": 45000, "clicks": 3200, "conversions": 450},
            {"name": "Campaign B", "impressions": 38000, "clicks": 2800, "conversions": 380},
            {"name": "Campaign C", "impressions": 52000, "clicks": 4100, "conversions": 520}
        ]
    }

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    pending_content = len([c for c in content_db if c.get('status') == 'pending'])
    approved_content = len([c for c in content_db if c.get('status') == 'approved'])
    active_campaigns = len([c for c in campaigns_db if c.get('status') == 'active'])
    
    return {
        "success": True,
        "totalClients": len(clients_db),
        "pendingContent": pending_content,
        "approvedContent": approved_content,
        "activeCampaigns": active_campaigns
    }

# Campaign Endpoints
@app.get("/api/campaigns")
async def get_campaigns():
    """Get all campaigns"""
    return {
        "success": True,
        "count": len(campaigns_db),
        "campaigns": campaigns_db
    }

@app.post("/api/campaigns")
async def create_campaign_endpoint(campaign: dict):
    """Create a new campaign"""
    campaign_data = {
        "id": f"CAMPAIGN_{len(campaigns_db) + 1:04d}",
        "name": campaign.get("name"),
        "client_id": campaign.get("client_id"),
        "client_name": next((c["company_name"] for c in clients_db if c["client_id"] == campaign.get("client_id")), "Unknown"),
        "platform": campaign.get("platform"),
        "budget": campaign.get("budget"),
        "start_date": campaign.get("start_date"),
        "end_date": campaign.get("end_date"),
        "target_audience": campaign.get("target_audience"),
        "ad_type": campaign.get("ad_type", "display"),
        "status": "active",
        "impressions": 0,
        "clicks": 0,
        "ctr": 0,
        "created_at": datetime.now().isoformat()
    }
    campaigns_db.append(campaign_data)
    return {
        "success": True,
        "message": "Campaign created",
        "data": campaign_data
    }

@app.put("/api/campaigns/{campaign_id}")
async def update_campaign_endpoint(campaign_id: str, campaign: dict):
    """Update a campaign"""
    campaign_item = next((c for c in campaigns_db if c.get('id') == campaign_id), None)
    if not campaign_item:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Campaign not found"}
        )
    
    for key, value in campaign.items():
        if key != 'id':
            campaign_item[key] = value
    
    campaign_item['updated_at'] = datetime.now().isoformat()
    return {
        "success": True,
        "message": "Campaign updated",
        "data": campaign_item
    }

@app.delete("/api/campaigns/{campaign_id}")
async def delete_campaign_endpoint(campaign_id: str):
    """Delete a campaign"""
    global campaigns_db
    campaigns_db = [c for c in campaigns_db if c.get('id') != campaign_id]
    return {
        "success": True,
        "message": "Campaign deleted"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
