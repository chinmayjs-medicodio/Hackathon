# 🚀 CampaignForge - AI-Powered Marketing Automation Platform

CampaignForge is an end-to-end marketing automation platform that leverages AI to streamline content creation, publishing, and performance tracking across multiple digital channels. This platform helps marketing agencies deliver consistent, scalable, and data-driven campaigns customized for each client.

## Features

- **AI-Driven Content Creation**: Generate marketing content (social media posts, blogs, newsletters, ad copy, images, videos) customized for each brand
- **Multi-Platform Posting Automation**: Automatically schedule and publish content across websites, LinkedIn, social media, email newsletters, and video channels
- **Content Review & Approval**: Review and approve content before publishing with AI quality checks and optional human/client approvals
- **Ads & Campaign Automation**: Create, manage, and optimize ad campaigns with A/B testing and budget optimization

## Project Structure

```
Hackathon/
├── backend/
│   ├── main.py              # FastAPI backend server
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html       # HTML template
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   └── ClientOnboarding.js
│   │   ├── services/
│   │   │   └── api.js       # API service layer
│   │   ├── App.js           # Main App component
│   │   ├── App.css
│   │   ├── index.js        # React entry point
│   │   └── index.css
│   ├── package.json         # Node.js dependencies
│   └── .gitignore
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Node.js 16.x or higher
- npm or yarn package manager
- A modern web browser

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the FastAPI server:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup (React)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will automatically open in your browser at `http://localhost:3000`

**Note**: The React app is configured to proxy API requests to `http://localhost:8000` (your FastAPI backend). Make sure the backend is running before using the frontend.

## API Endpoints

### Health Check
- `GET /health` - Check if the API is running

### Client Onboarding
- `POST /api/client/onboard` - Submit client onboarding form
  - Accepts form data with fields: company_name, industry, brand_tone, target_audience, etc.
  - Accepts file uploads for images and videos

### Client Management
- `GET /api/clients` - Get all onboarded clients
- `GET /api/client/{client_id}` - Get specific client by ID

## Client Onboarding Form Fields

### Required Fields
- Company Name
- Industry
- Brand Tone
- Target Audience

### Optional Fields
- Website URL
- Social Media Handles
- Marketing Goals
- Content Preferences
- Budget Range
- Primary Marketing Channels
- Past Marketing Examples
- Sample Texts/Content
- Images (multiple file upload)
- Videos (multiple file upload)

## Technology Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React 18, CSS3
- **API Communication**: RESTful API with JSON responses
- **Build Tool**: Create React App (react-scripts)

## Next Steps

This is the first phase of the project focusing on client onboarding. Future phases will include:
- AI content generation integration
- Multi-platform posting automation
- Content review and approval workflow
- Campaign management and optimization
- Analytics and performance tracking

## License

This project is created for hackathon purposes.

---

**Built with ❤️ for Marketing Automation**
"# Hackathon" 
