# CampaignForge - Complete Setup Guide

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
N8N_WEBHOOK_URL=http://localhost:5678/webhook
N8N_API_KEY=your_n8n_api_key_here
ENVIRONMENT=development
API_BASE_URL=http://localhost:8000
```

Start the backend server:
```bash
python main.py
```

The backend will run on `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

## 📋 Features

### ✅ Implemented Features

1. **SaaS Homepage**
   - Modern landing page with features showcase
   - Pricing plans
   - Call-to-action sections

2. **Client Onboarding**
   - Comprehensive form with all client details
   - File upload support (images, videos)
   - Automatic content generation after onboarding

3. **Content Approval Dashboard**
   - View all pending content
   - Approve, Edit, Delete, Regenerate options
   - Filter by client
   - Platform-specific content display

4. **Analytics Dashboard**
   - Performance metrics
   - Charts and graphs (Recharts)
   - Platform performance breakdown
   - Campaign performance tracking

5. **Campaign Automation**
   - Create and manage ad campaigns
   - Campaign performance tracking
   - Budget management
   - Multi-platform support

6. **AI Content Generation**
   - OpenAI GPT-4 integration
   - Platform-specific content generation
   - Brand-aligned content
   - Multiple content types (posts, blogs, newsletters, ad copy, video scripts)

7. **n8n Integration**
   - Automated posting to platforms
   - Webhook support
   - Multi-platform publishing

## 🔧 Configuration

### OpenAI API Key

1. Get your API key from https://platform.openai.com/api-keys
2. Add it to `backend/.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

### n8n Setup

1. Install n8n: https://docs.n8n.io/hosting/installation/
2. Create a webhook workflow in n8n
3. Update `backend/.env` with your n8n webhook URL:
   ```
   N8N_WEBHOOK_URL=http://localhost:5678/webhook/your-workflow-id
   ```

## 📁 Project Structure

```
Hackathon/
├── backend/
│   ├── main.py              # FastAPI server with all endpoints
│   ├── services.py          # OpenAI and n8n integration services
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables (create this)
├── frontend/
│   ├── src/
│   │   ├── components/      # React components (Navbar, Footer)
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.js
│   │   │   ├── Dashboard.js
│   │   │   ├── ClientOnboarding.js
│   │   │   ├── ContentApproval.js
│   │   │   ├── Analytics.js
│   │   │   └── CampaignAutomation.js
│   │   ├── services/
│   │   │   └── api.js       # API service layer
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── public/
└── README.md
```

## 🎯 API Endpoints

### Client Management
- `POST /api/client/onboard` - Onboard new client
- `GET /api/clients` - Get all clients
- `GET /api/client/{client_id}` - Get specific client

### Content Management
- `GET /api/content/pending` - Get pending content
- `POST /api/content/{id}/approve` - Approve and post content
- `PUT /api/content/{id}/edit` - Edit content
- `DELETE /api/content/{id}` - Delete content
- `POST /api/content/{id}/regenerate` - Regenerate content

### Analytics
- `GET /api/analytics` - Get analytics data
- `GET /api/dashboard/stats` - Get dashboard statistics

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/{id}` - Update campaign
- `DELETE /api/campaigns/{id}` - Delete campaign

## 🔐 Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_key_here
N8N_WEBHOOK_URL=http://localhost:5678/webhook
N8N_API_KEY=optional_api_key
ENVIRONMENT=development
API_BASE_URL=http://localhost:8000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

## 🚦 Usage Flow

1. **Onboard Client**: Fill out the client onboarding form
2. **Content Generation**: AI automatically generates content for all selected platforms
3. **Review & Approve**: Review generated content in the Content Approval page
4. **Edit/Regenerate**: Make changes or regenerate specific content
5. **Approve & Post**: Approve content to automatically post via n8n
6. **Track Performance**: Monitor analytics and campaign performance

## 🛠️ Troubleshooting

### Backend Issues
- Ensure Python 3.8+ is installed
- Install all dependencies: `pip install -r requirements.txt`
- Check `.env` file exists and has correct API keys
- Verify port 8000 is not in use

### Frontend Issues
- Ensure Node.js 16+ is installed
- Install dependencies: `npm install`
- Check if backend is running on port 8000
- Clear browser cache if needed

### OpenAI Issues
- Verify API key is correct
- Check API quota/limits
- Ensure internet connection for API calls

### n8n Issues
- Verify n8n is running
- Check webhook URL is correct
- Test webhook manually in n8n interface

## 📝 Notes

- In production, replace in-memory storage with a database
- Add authentication and authorization
- Implement rate limiting
- Add error logging and monitoring
- Use environment-specific configurations

## 🎉 You're All Set!

Start both servers and visit `http://localhost:3000` to begin using CampaignForge!
