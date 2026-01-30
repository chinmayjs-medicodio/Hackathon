# CampaignForge Frontend (React)

This is the React frontend for CampaignForge - AI-Powered Marketing Automation Platform.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   The app will automatically open at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (irreversible)

## Project Structure

```
src/
├── components/
│   ├── Header.js              # Header component
│   ├── Header.css
│   ├── Footer.js              # Footer component
│   ├── Footer.css
│   ├── ClientOnboarding.js    # Main onboarding form component
│   └── ClientOnboarding.css
├── services/
│   └── api.js                 # API service for backend communication
├── App.js                     # Main App component
├── App.css
├── index.js                   # React entry point
└── index.css                  # Global styles
```

## Environment Variables

You can create a `.env` file in the frontend directory to customize the API URL:

```
REACT_APP_API_URL=http://localhost:8000
```

By default, the app uses `http://localhost:8000` as the backend API URL.

## Features

- ✅ Modern React 18 with Hooks
- ✅ Responsive design
- ✅ Form validation
- ✅ File upload support (images & videos)
- ✅ Error handling
- ✅ Success feedback
- ✅ API integration with FastAPI backend

## Development Notes

- The app uses React functional components with hooks
- State management is handled with `useState` and `useEffect`
- API calls are abstracted in the `services/api.js` file
- All styling uses CSS modules approach with separate CSS files per component
