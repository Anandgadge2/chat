# PugArch FSM Support Assistant

An AI-powered, mobile-first support chatbot for the PugArch FSM mobile application. This chatbot helps users resolve common app issues instantly using predefined solutions and Gemini API for semantic issue matching.

## 🎯 Features

- **AI-Powered Issue Matching**: Uses Gemini API to semantically match free-text user queries to predefined support issues
- **Predefined Support Solutions**: 15 categorized support issues covering Login, GPS/Location, Attendance, App Performance, and Data Sync
- **Multilingual Support**: Supports 9 Indian languages (English, Hindi, Marathi, Odia, Bengali, Tamil, Telugu, Kannada, Gujarati)
- **Voice Input & Output**: Browser-based speech recognition and text-to-speech support
- **Responsive Mobile-First Design**: Light theme UI optimized for mobile and desktop
- **Smart Escalation**: Automatically escalates issues to human support when unresolved
- **Session Management**: Tracks conversations and creates support tickets for escalations
- **Translation Support**: Integrates LibreTranslate with Gemini fallback

## 📋 Project Structure

```
app/
  layout.tsx                 # Root layout
  page.tsx                   # Main support assistant page
  globals.css                # Global styles
  api/
    chat/
      match-issue/
        route.ts             # API to match user message to support issue
    translate/
      route.ts               # API to translate text to target language
    feedback/
      route.ts               # API to record user feedback
    support-ticket/
      route.ts               # API to create and manage support tickets

components/
  ChatWindow.tsx             # Main chat orchestrator component
  ChatMessage.tsx            # Individual chat message display
  ChatInput.tsx              # User input with voice button
  LanguageSelector.tsx       # Language selector dropdown
  CategorySelector.tsx       # Support category buttons
  IssueOptions.tsx           # Issue selection buttons
  VoiceInputButton.tsx       # Speech-to-text button
  FeedbackButtons.tsx        # Yes/No feedback buttons
  SupportDetailsForm.tsx     # Escalation form

lib/
  supportIssues.ts           # 15 predefined support issues database
  gemini.ts                  # Gemini API integration
  translate.ts               # Translation service wrapper
  speech.ts                  # Speech recognition & synthesis utilities
  validators.ts              # Input validation functions
  constants.ts               # UI strings and constants
  logger.ts                  # Logging utility

types/
  support.ts                 # Support-related TypeScript types
  chat.ts                    # Chat-related types

Configuration Files:
  package.json               # Dependencies
  tsconfig.json              # TypeScript configuration
  tailwind.config.js         # Tailwind CSS configuration
  postcss.config.js          # PostCSS configuration
  next.config.js             # Next.js configuration
  .env.example               # Environment variables template
  .eslintrc.json             # ESLint configuration
```

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- Gemini API key (from Google AI Studio)

### 2. Installation

```bash
# Clone or navigate to project directory
cd chat

# Install dependencies
npm install
```

### 3. Environment Setup

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```env
# Required: Gemini API Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Optional: LibreTranslate for self-hosted translation
# If not configured, Gemini will handle translation
LIBRETRANSLATE_URL=http://localhost:5000
LIBRETRANSLATE_API_KEY=your_api_key

# Optional: Database URL (for persistence)
# DATABASE_URL=your_database_url

# App Configuration
NEXT_PUBLIC_APP_NAME=PugArch FSM Support
NODE_ENV=development
```

### 4. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create a new API key
4. Copy and paste it in `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 6. Build for Production

```bash
npm run build
npm start
```

## 📱 Testing the Chatbot

### Test 1: Category Selection Flow
1. Open the app
2. Click "Login & Account" category
3. Select "Unable to login"
4. See the solution
5. Click "No" to test escalation form

### Test 2: Free Text Matching
1. Type "face scan is not working"
2. Bot should match to C1 (Face recognition failed)
3. See solution and verify accuracy

### Test 3: Voice Input
1. Click microphone button
2. Speak "my attendance is not syncing"
3. Verify text is captured
4. Confirm bot matches to C2

### Test 4: Voice Output
1. Click "Speak" button on bot response
2. Verify bot speaks the solution
3. Test in different language

### Test 5: Escalation
1. Select an issue
2. Click "No" for feedback
3. Fill out support form
4. Submit and verify success message

### Test 6: Language Translation
1. Select "हिन्दी" from language dropdown
2. Go through chat flow
3. Verify responses are in Hindi
4. Test voice output in Hindi

### Test 7: Multi-Turn Conversation
1. Start chat
2. Ask different types of questions
3. Test back navigation
4. Test reset functionality

## 🔑 API Endpoints

### POST `/api/chat/match-issue`
Matches user message to a support issue using Gemini API.

**Request:**
```json
{
  "message": "my face recognition is not working",
  "selectedLanguage": "en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "matchedCode": "C1",
    "confidence": 0.92,
    "detectedLanguage": "en",
    "needsEscalation": false
  }
}
```

### POST `/api/translate`
Translates text to target language using LibreTranslate or Gemini.

**Request:**
```json
{
  "text": "Face recognition failed",
  "targetLanguage": "hi",
  "sourceLanguage": "en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "translatedText": "चेहरे की पहचान विफल",
    "provider": "gemini",
    "language": "hi"
  }
}
```

### POST `/api/feedback`
Records user feedback on solution helpfulness.

**Request:**
```json
{
  "sessionId": "uuid-here",
  "issueCode": "C1",
  "helpful": true,
  "selectedLanguage": "en"
}
```

### POST `/api/support-ticket`
Creates an escalation ticket when issue is unresolved.

**Request:**
```json
{
  "sessionId": "uuid-here",
  "fullName": "John Doe",
  "contactNumber": "9876543210",
  "designation": "Security Guard",
  "department": "Security",
  "issueDescription": "Detailed description of the issue",
  "matchedIssueCode": "C1",
  "conversationHistory": []
}
```

## 🎨 UI/UX Design

### Color Scheme (Light Theme)
- **Primary**: `#2563eb` (Blue) - Main actions
- **Secondary**: `#10b981` (Green) - Positive actions
- **Light**: `#f3f4f6` (Light Gray) - Background
- **Border**: `#e5e7eb` (Gray) - Dividers
- **Text Primary**: `#111827` (Dark Gray) - Main text
- **Text Secondary**: `#6b7280` (Medium Gray) - Secondary text

### Key UI Elements
- **Chat Bubbles**: Rounded, soft shadows
- **Buttons**: Full-width on mobile, flexible on desktop
- **Forms**: Clean, labeled inputs with validation
- **Messages**: User (blue) and Bot (gray) distinction
- **Loading**: Animated spinner with "Thinking..." message
- **Scrolling**: Smooth auto-scroll to latest message

## 🌐 Supported Languages

| Code | Language | Native Name |
|------|----------|-------------|
| en   | English  | English     |
| hi   | Hindi    | हिन्दी      |
| mr   | Marathi  | मराठी       |
| or   | Odia     | ଓଡ଼ିଆ       |
| bn   | Bengali  | বাংলা      |
| ta   | Tamil    | தமிழ்      |
| te   | Telugu   | తెలుగు      |
| kn   | Kannada  | ಕನ್ನಡ      |
| gu   | Gujarati | ગુજરાતી    |

## 📚 Support Issues Database

The chatbot includes 15 predefined support issues across 5 categories:

### Category A: Login & Account (2 issues)
- A1: User not found during signup
- A2: Unable to login

### Category B: Location, GPS & Geofence (4 issues)
- B1: Out of geofence message
- B2: Site or geofence not visible
- B3: Geofence missing from map
- B4: Location not fetching

### Category C: Attendance & Tracking (5 issues)
- C1: Face recognition failed
- C2: Attendance not syncing
- C3: Live tracking not updating
- C4: Tracking showing wrong route
- C5: Patrolling status not updating

### Category D: App Crashes & Performance (3 issues)
- D1: App crashing frequently
- D2: Slow app performance
- D3: App not installing

### Category E: Data & Sync (1 issue)
- E1: Data loss after logout

Each issue includes:
- Possible reason
- Step-by-step solution
- Escalation requirements
- Keywords for semantic matching

## 🔒 Security & Privacy

- **API Keys**: Gemini API key stored server-side only
- **No Sensitive Data**: Never asks for passwords, OTPs, Aadhaar, PAN
- **Input Validation**: All user inputs sanitized and validated
- **Privacy Notice**: Shown before collecting support details
- **Error Handling**: Technical errors logged server-side, user-friendly messages shown

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Deploy to Other Platforms

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy `out/` directory to your platform
3. Set `GEMINI_API_KEY` and other env variables

## 📝 Configuration

### Gemini Model Settings
- **Model**: `gemini-1.5-flash` (fast and cost-effective)
- **Temperature**: 0.1 (for consistent matching)
- **Max Tokens**: 300 for matching, 2000 for translation

### Web Speech API Support
- **Speech Recognition**: Supported in Chrome, Edge, Safari
- **Speech Synthesis**: Supported in all modern browsers
- **Fallback**: Text input if speech not supported

## 🐛 Troubleshooting

### Gemini API Not Working
- Verify API key is correct in `.env.local`
- Check API key is not expired
- Enable Generative AI API in Google Cloud Console

### Translation Not Working
- If LibreTranslate configured, verify it's running
- Check network connectivity
- Gemini fallback will be used if LibreTranslate fails

### Voice Features Not Working
- Check browser supports Web Speech API
- Verify microphone permissions are granted
- Try a different browser (Chrome, Edge recommended)

### Build Errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## 📊 Performance

- **Initial Load**: < 2 seconds
- **Chat Response**: < 1 second (cached) to 2-3 seconds (Gemini)
- **Translation**: 1-2 seconds (LibreTranslate) or 2-3 seconds (Gemini)
- **Bundle Size**: ~150KB gzipped

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use Tailwind CSS for styling
3. Write self-documenting code
4. Test voice features across browsers
5. Validate multilingual content

## 📄 License

This project is proprietary software for PugArch FSM.

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review API route implementations
3. Check browser console for errors
4. Verify environment variables are set

---

**Built with**: Next.js 14 • TypeScript • Tailwind CSS • Gemini API
