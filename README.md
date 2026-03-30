# CV Builder Pro

CV Builder Pro is a modern resume builder web app that helps users create ATS-friendly CVs, export them as PDF or DOCX, and share them with a public link.

## Main Features

- Auth (Login/Register) with Firebase Authentication
- Multi-language UI:Arabic ,English, French (RTL support)
- Dark/Light mode
- Step-by-step CV builder flow
- ATS-friendly preview format
- Export to PDF
- Export to Word (.docx)
- Shareable public CV link
- Auto-save/load CV data with Firestore

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Firebase (Auth + Firestore)
- next-themes
- html2pdf.js
- docx + file-saver

## Project Structure

- `src/app` - pages and routes
- `src/components/common/cv` - CV builder, preview, forms
- `src/components/common/landing-page` - landing sections
- `src/contexts` - auth, CV, i18n providers
- `src/hooks` - storage and helper hooks
- `src/lib` - firebase and utility modules
- `src/types` - shared TypeScript types

## Environment Variables

Create a `.env.local` file in the project root with:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

- http://localhost:3000

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Build for Production

```bash
npm run build
npm run start
```

## Firebase Notes

- Firestore rules are defined in `firestore.rules`
- Firebase project config is managed with `.firebaserc` and `firebase.json`
- Deploy rules with:

```bash
firebase deploy --only firestore:rules --project <your-project-id>
```

## License

Private project.
