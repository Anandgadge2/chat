# Complete Setup Guide - PugArch FSM Support Assistant

This guide provides step-by-step instructions to set up, configure, and test the PugArch FSM Support Assistant.

## Phase 1: Initial Setup (5 minutes)

### Step 1.1: Install Node.js
If not already installed:
- Download from [nodejs.org](https://nodejs.org/) (version 18.17 or later)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### Step 1.2: Install Dependencies
```bash
cd c:\Users\anand\OneDrive\Desktop\chat
npm install
```

This installs:
- Next.js 14 (React framework)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Axios (HTTP client)
- UUID (unique ID generation)

### Step 1.3: Verify Installation
```bash
npm run build
```

If build succeeds, proceed to next phase.

## Phase 2: API Key Configuration (3 minutes)

### Step 2.1: Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated API key
4. Never share this key publicly

### Step 2.2: Create Environment File

```bash
# Copy the example file
copy .env.example .env.local
```

### Step 2.3: Add Gemini API Key

Open `.env.local` and replace:
```env
GEMINI_API_KEY=paste_your_actual_api_key_here
```

Example (with placeholder):
```env
GEMINI_API_KEY=AIzaSyD_fake_key_example_1234567890abcdefghijklm
LIBRETRANSLATE_URL=
LIBRETRANSLATE_API_KEY=
NEXT_PUBLIC_APP_NAME=PugArch FSM Support
NODE_ENV=development
```

### Step 2.4: Verify Configuration

```bash
# Start the app
npm run dev
```

You should see:
```
  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Environments: .env.local
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Phase 3: Testing the Chatbot (15 minutes)

### Test Suite 1: Basic Chat Flow

#### Test 1.1: Welcome Screen
**Goal**: Verify welcome message and category options are displayed

**Steps**:
1. Open the app
2. See the welcome message: "Hi! Welcome to PugArch FSM Support..."
3. See 5 category buttons:
   - Login & Account
   - Location, GPS & Geofence
   - Attendance & Tracking
   - App Crashes & Performance
   - Data & Sync

**Expected**: All buttons visible and clickable

---

#### Test 1.2: Category Selection
**Goal**: Verify category selection shows related issues

**Steps**:
1. Click "Login & Account" button
2. See the bot message: "You selected: Login & Account"
3. See issue buttons:
   - [A1] User not found during signup
   - [A2] Unable to login
   - My issue is different

**Expected**: All issue buttons displayed correctly

---

#### Test 1.3: Solution Display
**Goal**: Verify solution is shown after issue selection

**Steps**:
1. Click "Unable to login" issue
2. Wait for bot response (1-2 seconds)
3. See solution with:
   - "Here is the solution:"
   - "Possible Reason: Wrong credentials or inactive account."
   - "Steps to resolve:" with numbered steps
4. See "Was this helpful?" with Yes/No buttons

**Expected**: 
- Solution displayed clearly
- Steps are numbered
- Feedback buttons visible

---

### Test Suite 2: Free-Text Issue Matching

#### Test 2.1: Simple Text Matching
**Goal**: Verify Gemini successfully matches simple text queries

**Steps**:
1. Click "Reset Chat" or refresh page
2. Type: "my face scan is not working"
3. Wait 2-3 seconds for Gemini processing
4. See bot respond with C1 issue solution
5. Verify "Face recognition failed" is the matched issue

**Expected**: Correct issue matched with high confidence

---

#### Test 2.2: Complex Phrasing
**Goal**: Verify matching works with different phrasings

**Steps**:
1. Reset chat
2. Type: "location not showing on map"
3. Wait for response
4. Should match to B2 or B4

**Test Different Phrases**:
- "app keeps crashing" → D1
- "attendance upload problem" → C2
- "cannot login to app" → A2
- "gps not working" → B4
- "app is very slow" → D2

**Expected**: All queries match to correct issue codes

---

#### Test 2.3: Low Confidence Handling
**Goal**: Verify fallback when no confident match

**Steps**:
1. Reset chat
2. Type: "hello" or "what is this"
3. Should see: "I was not able to find a solution..."
4. Escalation form should appear

**Expected**: System gracefully handles unmatched queries

---

### Test Suite 3: Feedback & Escalation

#### Test 3.1: Helpful Solution
**Goal**: Verify "Yes" feedback closes chat

**Steps**:
1. Go through any issue solution
2. Click "Yes" on "Was this helpful?"
3. See message: "Great! Glad I could help..."
4. See "Start New Chat" button

**Expected**: Resolution confirmed

---

#### Test 3.2: Unhelpful Solution
**Goal**: Verify "No" shows escalation form

**Steps**:
1. Go through any issue solution
2. Click "No" on "Was this helpful?"
3. See: "Sorry the solution did not work..."
4. See form with fields:
   - Full Name *
   - Contact Number *
   - Designation *
   - Department *
   - Describe Your Issue *

**Expected**: All form fields visible and required

---

#### Test 3.3: Form Validation
**Goal**: Verify form validates inputs

**Steps**:
1. Try submitting empty form
2. See error: "Full name must be at least 2 characters"
3. Enter name: "J" (too short)
4. Click Submit
5. See validation error

**Test Each Field**:
- Full Name: min 2, max 100 chars
- Contact: 10-13 digits
- Designation: required
- Department: required
- Description: min 10 chars

**Expected**: 
- All validations work
- Errors displayed clearly
- Submit disabled for invalid data

---

#### Test 3.4: Form Submission
**Goal**: Verify form successfully submits

**Steps**:
1. Fill form with valid data:
   - Full Name: John Doe
   - Contact: 9876543210
   - Designation: Security Guard
   - Department: Security
   - Issue: Detailed description here...
2. Click Submit
3. See: "Your issue has been shared with the support team..."
4. See "Start New Chat" button

**Expected**: 
- Form submits without errors
- Success message displayed
- Chat can be restarted

---

### Test Suite 4: Multilingual Support

#### Test 4.1: Language Selection
**Goal**: Verify language selector works

**Steps**:
1. See language dropdown at top right
2. Default should be "English"
3. Click dropdown
4. See all languages:
   - English
   - हिन्दी
   - मराठी
   - ଓଡ଼ିଆ
   - বাংলা
   - தமிழ்
   - తెలుగు
   - ಕನ್ನಡ
   - ગુજરાતી

**Expected**: All languages listed

---

#### Test 4.2: Hindi Translation
**Goal**: Verify content translates to Hindi

**Steps**:
1. Select "हिन्दी" from language dropdown
2. See welcome message translated
3. Click "Login & Account"
4. See category name and issues in Hindi
5. Select "Unable to login"
6. See solution in Hindi

**Expected**: 
- All text translated
- Issue codes (A2, B1, etc.) remain unchanged
- Solution steps in Hindi

---

#### Test 4.3: Language Persistence
**Goal**: Verify language persists across chat

**Steps**:
1. Select Hindi
2. Go through chat flow
3. All messages in Hindi
4. Reset chat
5. See welcome in Hindi (language persists)

**Expected**: Language stays selected

---

### Test Suite 5: Voice Features (Browser-dependent)

#### Test 5.1: Voice Input
**Goal**: Verify speech-to-text works

**Steps**:
1. Ensure microphone is connected
2. Check browser permissions for microphone
3. Click microphone button (🎤)
4. Wait for "Listening..." status
5. Say clearly: "face recognition not working"
6. Wait for text to appear in input box
7. See message sent automatically

**Browser Support**:
- ✅ Chrome: Full support
- ✅ Edge: Full support
- ✅ Safari: Partial support
- ❌ Firefox: Limited support

**If Not Supported**:
- Button won't appear
- Use text input instead
- See message: "Voice input not supported on this browser"

**Expected**: 
- Spoken text captured
- Message sent
- Bot responds

---

#### Test 5.2: Voice Output
**Goal**: Verify text-to-speech works

**Steps**:
1. Get any bot response
2. Click "🔊 Speak" button
3. Hear bot's response read aloud
4. Click "Stop" to stop speaking

**Browser Support**: Most modern browsers

**If Not Supported**:
- "Speak" button hidden
- Text visible but not spoken

**Expected**: 
- Audio plays clearly
- Correct language/voice
- Can be stopped

---

#### Test 5.3: Voice in Different Languages
**Goal**: Verify voice works in multiple languages

**Steps**:
1. Select "हिन्दी" (Hindi)
2. Go through chat flow
3. Click "Speak" on bot response
4. Hear Hindi voice

**Test Multiple Languages**:
- English: Standard English voice
- Hindi: Hindi voice
- Tamil: Tamil voice
- Gujarati: Gujarati voice

**Expected**: 
- Appropriate voice for each language
- Clear pronunciation
- Smooth playback

---

### Test Suite 6: Error Handling

#### Test 6.1: Network Error Handling
**Goal**: Verify graceful handling of API failures

**Steps**:
1. Disconnect internet
2. Try to submit support form or match issue
3. See error message
4. App should remain functional
5. Reconnect internet and retry

**Expected**: 
- User-friendly error messages
- App doesn't crash
- Can retry after reconnection

---

#### Test 6.2: API Timeout Handling
**Goal**: Verify handling of slow Gemini API

**Steps**:
1. Type a complex query
2. Wait for Gemini response (2-3 seconds)
3. See loading spinner: "⏳ Thinking..."
4. Bot responds with solution

**Expected**: 
- Loading state shown
- No timeout errors
- Response received

---

### Test Suite 7: Responsive Design

#### Test 7.1: Mobile View
**Goal**: Verify mobile-first design

**Steps**:
1. Open DevTools (F12)
2. Set device: iPhone SE
3. Verify:
   - Header is readable
   - Chat bubbles fit screen
   - Input field is accessible
   - Buttons are finger-friendly (min 44px height)
   - No horizontal scrolling

**Expected**: 
- All elements visible
- Text readable
- Touch targets appropriate
- Proper spacing

---

#### Test 7.2: Tablet View
**Goal**: Verify tablet responsiveness

**Steps**:
1. Set device: iPad
2. Verify:
   - Content width optimized
   - Buttons appropriately sized
   - Chat window readable
   - Form inputs comfortable to use

**Expected**: Optimized for tablet

---

#### Test 7.3: Desktop View
**Goal**: Verify desktop layout

**Steps**:
1. Full browser window
2. Verify:
   - Max width applied (1024px recommended)
   - Centered on screen
   - Properly spaced
   - Form layout clear

**Expected**: Professional desktop layout

---

## Phase 4: Advanced Testing

### Test 4.1: Session Management

**Steps**:
1. Start chat and go through conversation
2. Open browser DevTools → Application → Local Storage
3. Verify session data is stored (if implemented)
4. Close and reopen browser
5. Verify conversation history (if persisted)

---

### Test 4.2: API Response Validation

**Steps**:
1. Open DevTools → Network tab
2. Perform chat action
3. Check API calls:
   - `/api/chat/match-issue` returns matchedCode
   - `/api/translate` returns translatedText
   - `/api/support-ticket` returns ticket ID

---

### Test 4.3: Performance Monitoring

**Steps**:
1. Open DevTools → Performance tab
2. Start recording
3. Type message and see response
4. Stop recording
5. Check:
   - Interaction to Paint < 100ms
   - No layout thrashing
   - Smooth scrolling (60fps)

---

## Troubleshooting Common Issues

### Issue: "API Key not configured"
**Solution**:
1. Verify `.env.local` file exists
2. Check `GEMINI_API_KEY` is set correctly
3. Restart development server: `npm run dev`

### Issue: Voice input not working
**Solution**:
1. Check browser is Chrome, Edge, or Safari
2. Allow microphone permissions
3. Verify microphone is not in use by another app
4. Check browser console for errors

### Issue: Translation not working
**Solution**:
1. Verify Gemini API key is valid
2. Check API rate limits (free tier has limits)
3. Try with simpler text first

### Issue: "Something went wrong" message
**Solution**:
1. Check browser console for error details
2. Verify all API keys are set
3. Check network tab for failed requests
4. Restart development server

### Issue: Build fails
**Solution**:
```bash
# Clear cache and reinstall
rm -r node_modules .next
npm install
npm run build
```

---

## Performance Benchmarks

After successful setup, verify these benchmarks:

| Metric | Target | Actual |
|--------|--------|--------|
| Page Load Time | < 2s | ? |
| API Response | < 2s | ? |
| Chat Response | < 3s | ? |
| Voice Input | < 5s | ? |
| Voice Output | Immediate | ? |
| Translation | < 3s | ? |

---

## Next Steps

1. **Customize Content**: Edit `lib/supportIssues.ts` to add/modify issues
2. **Deploy**: Follow [README.md](./README.md) deployment section
3. **Database Integration**: Implement persistent storage (PostgreSQL, MongoDB)
4. **Analytics**: Add tracking for conversation quality
5. **Admin Panel**: Create dashboard for support team

---

## Support

For issues:
1. Check all troubleshooting sections
2. Review error messages in browser console
3. Verify `.env.local` configuration
4. Check API key validity

Good luck! 🚀
