# Quick Reference Guide

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add API key
copy .env.example .env.local
# Edit .env.local and add GEMINI_API_KEY

# 3. Start server
npm run dev

# 4. Open browser
# http://localhost:3000
```

## 📁 Key Files to Customize

### 1. Add/Modify Support Issues
**File**: `lib/supportIssues.ts`

Add a new issue:
```typescript
{
  code: "X1",
  category: "New Category",
  title: "Issue Title",
  possibleReason: "Why this happens",
  solutionSteps: ["Step 1", "Step 2"],
  requiresUserDetails: false,
  escalationRequiredIfNotSolved: true,
  keywords: ["keyword1", "keyword2"],
}
```

### 2. Change Colors/Theme
**File**: `tailwind.config.js`

```javascript
colors: {
  primary: '#2563eb',      // Change blue
  secondary: '#10b981',    // Change green
  light: '#f3f4f6',        // Change light bg
}
```

### 3. Change UI Strings
**File**: `lib/constants.ts`

```typescript
export const WELCOME_MESSAGE = "Your custom message";
export const BUTTON_LABELS = { ... };
```

### 4. Add Languages
**Files**: `types/chat.ts` and `lib/speech.ts`

Add to LANGUAGE_NAMES and LANGUAGE_CODES

### 5. Customize Form Fields
**File**: `components/SupportDetailsForm.tsx`

Edit FORM_LABELS and FORM_PLACEHOLDERS

---

## 🔑 Environment Variables

```env
# Required
GEMINI_API_KEY=your_actual_key

# Optional
LIBRETRANSLATE_URL=http://localhost:5000
LIBRETRANSLATE_API_KEY=your_key
DATABASE_URL=your_db_url
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=PugArch FSM Support
```

---

## 📦 Dependency Management

```bash
# Update all packages
npm update

# Add new package
npm install package-name

# Remove package
npm uninstall package-name

# Check for vulnerabilities
npm audit
npm audit fix
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "API key not configured" | Add GEMINI_API_KEY to .env.local |
| "Voice not working" | Use Chrome/Edge, check microphone |
| Build fails | `rm -r node_modules .next && npm install` |
| Port 3000 in use | `npm run dev -- -p 3001` |
| Gemini API errors | Check API key validity at console.cloud.google.com |

---

## 🧪 Testing Commands

```bash
# Build for production
npm run build

# Run production build
npm start

# Check for errors
npm run lint

# Type check
npx tsc --noEmit
```

---

## 📊 Performance Tips

1. **Translation Cache**: Enabled automatically in `lib/translate.ts`
2. **Gemini Settings**: Temperature 0.1 for consistency
3. **Web Speech API**: Falls back gracefully
4. **Image Optimization**: Use Next.js Image component (if adding)
5. **Code Splitting**: Automatic with Next.js

---

## 🌐 Deployment Checklist

- ✅ Add GEMINI_API_KEY to platform env vars
- ✅ Set NODE_ENV=production
- ✅ Run `npm run build` locally to test
- ✅ Verify all API routes work
- ✅ Test voice features in deployment
- ✅ Monitor API usage
- ✅ Set up error tracking

**Vercel Deployment**:
```bash
npm install -g vercel
vercel
# Follow prompts, add env vars in dashboard
```

---

## 💡 Architecture Quick Ref

```
User Input
    ↓
ChatWindow Component (Frontend)
    ↓
→ Category Selection
→ Issue Selection
→ Free-text Input (Gemini matching)
→ Voice Input (Speech API)
    ↓
API Routes (Backend)
    ↓
→ /api/chat/match-issue (Gemini)
→ /api/translate (Gemini/LibreTranslate)
→ /api/feedback (Storage)
→ /api/support-ticket (Storage)
    ↓
Response → ChatWindow → Display to User
    ↓
Voice Output (Speech API)
```

---

## 🔒 Security Checklist

- ✅ Never commit .env.local
- ✅ API keys server-side only
- ✅ Input sanitization done
- ✅ Form validation enabled
- ✅ No sensitive data in logs
- ✅ HTTPS ready (enable in production)

---

## 📱 Testing on Device

```bash
# Get local IP
ipconfig getifaddr en0  # macOS
ipconfig              # Windows

# On same network:
http://YOUR_IP:3000
```

---

## 🎓 Component Tree

```
<RootLayout>
  <ChatWindow>
    ├── Header (Language Selector)
    ├── Messages Area
    │   └── ChatMessage (repeated)
    │       └── Speak Button
    ├── Flow Components:
    │   ├── CategorySelector
    │   ├── IssueOptions
    │   ├── SupportDetailsForm
    │   └── FeedbackButtons
    └── ChatInput
        ├── VoiceInputButton
        └── Send Button
```

---

## 📝 Code Style

- **Naming**: camelCase for variables, PascalCase for components
- **Imports**: Group by: react, external, internal
- **Types**: Use TypeScript interfaces, avoid `any`
- **Comments**: Only for complex logic
- **Formatting**: Prettier compatible

---

## 🚀 Feature Toggle Template

For A/B testing or feature flags:

```typescript
// Feature flags in lib/constants.ts
export const FEATURES = {
  voiceInput: true,
  voiceOutput: true,
  translation: true,
  escalation: true,
};

// Use in components
{FEATURES.voiceInput && <VoiceInputButton {...props} />}
```

---

## 📊 Analytics Integration Ready

Add to `/api/*` routes:

```typescript
// Track API calls
logInfo('API called', { endpoint, success, duration });

// Track user actions
logInfo('Issue matched', { code, confidence });

// Integrate with:
// - Google Analytics
// - Mixpanel
// - Amplitude
// - Custom Dashboard
```

---

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Gemini API](https://ai.google.dev/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

## 💬 Need Help?

1. Check [README.md](./README.md) for full documentation
2. Review [SETUP.md](./SETUP.md) for detailed setup guide
3. Check [DELIVERABLES.md](./DELIVERABLES.md) for all created files
4. Review code comments in lib/ and components/
5. Check browser console for error messages

---

**Happy Coding! 🎉**
