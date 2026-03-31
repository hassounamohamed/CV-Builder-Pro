# AI Features Setup Guide

## 🚀 Local Development Setup

### Step 1: Create `.env.local` file

Create a new file in the root directory: `.env.local`

```bash
# Copy from .env.example
cp .env.example .env.local
```

### Step 2: Add your OpenRouter API Key

Open `.env.local` and replace the placeholder with your actual API key:

```
NEXT_PUBLIC_OPENROUTER_API_KEY=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
```

### Step 3: Restart the dev server

```bash
npm run dev
```

The API key is now loaded locally. `.env.local` is automatically ignored by git (see `.gitignore`).

---

## 🌐 Deploy to Vercel

### Step 1: Push to GitHub (without .env.local)

```bash
git add .
git commit -m "Add AI features"
git push origin main
```

✅ `.env.local` is NOT pushed (protected by .gitignore)

### Step 2: Add environment variable to Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `NEXT_PUBLIC_OPENROUTER_API_KEY`
   - **Value**: Your OpenRouter API key
   - **Environments**: Select Production, Preview, Development
4. Click **Save**
5. **Redeploy** your project

### Step 3: Verify

Visit your Vercel deployment and test the AI features.

---

## 📝 Using AI Features in Components

### Example: Improve Summary

```tsx
import { useAI } from '@/hooks/useAI'
import { Button } from '@/components/ui/button'

export function SummaryForm() {
  const { improve, isLoading } = useAI()
  const [summary, setSummary] = useState('')

  const handleImprove = async () => {
    const improved = await improve({
      type: 'improve-summary',
      content: summary,
    })
    if (improved) {
      setSummary(improved)
    }
  }

  return (
    <div>
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Enter your professional summary"
      />
      <Button
        onClick={handleImprove}
        disabled={isLoading}
      >
        {isLoading ? 'Improving...' : '✨ Improve with AI'}
      </Button>
    </div>
  )
}
```

---

## 🔒 Security Notes

✅ API key is stored in environment variables  
✅ Never committed to GitHub  
✅ Server-side API route protects the key  
✅ Client only calls `/api/ai-improve` endpoint  
✅ Works on Vercel with environment variables  

---

## 🆘 Troubleshooting

**"API key not configured" error:**
- Make sure `.env.local` exists locally
- For Vercel: Check environment variables are set in Vercel dashboard
- Restart dev server after creating `.env.local`

**"Failed to improve content" error:**
- Check your OpenRouter API key is valid
- Verify you have API quota available
- Check browser console for detailed error

---

## 📚 Resources

- [OpenRouter Docs](https://openrouter.ai/docs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)
