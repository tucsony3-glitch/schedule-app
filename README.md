# Schedule App

A simple, installable PWA (Progressive Web App) calendar that syncs with **Google Calendar**. Built with React + Vite.

シンプルなPWAスケジュールアプリです。Googleカレンダーと同期し、スマートフォンのホーム画面にアプリとしてインストールできます。

## Features

- Sign in with Google and view/create/edit/delete events on your primary Google Calendar
- Month view calendar with a day-detail modal for viewing all events on a selected day
- Installable as a PWA (works offline-friendly, home screen icon, app badge showing today's event count)
- iOS-friendly OAuth flow (redirect-based sign-in, since popup-based OAuth is unreliable in iOS Safari)
- Automatic sign-out and re-prompt when the Google access token expires

## Tech stack

- [React](https://react.dev/) 19 + [Vite](https://vitejs.dev/)
- [@react-oauth/google](https://github.com/MomenSherif/react-oauth) for Google OAuth
- [date-fns](https://date-fns.org/) for date handling
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) for PWA/service worker support

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Google OAuth Client ID

This app needs a Google OAuth 2.0 Client ID to authenticate with Google Calendar:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Google Calendar API**
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**
5. Choose **Web application** as the application type
6. Add your local dev URL (e.g. `http://localhost:5173`) and your production URL to **Authorized JavaScript origins**
7. Copy the generated Client ID

### 3. Configure environment variables

Create a `.env` file in the project root:

```
VITE_GOOGLE_CLIENT_ID=<your Google OAuth client ID>
```

`VITE_GOOGLE_CLIENT_ID` is bundled into the client build (it is a public identifier, not a secret), but the `.env` file itself is git-ignored so each environment can supply its own value.

### 4. Run the app

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

The production build is output to `dist/`.

## License

Released under the [MIT License](./LICENSE).
