# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Course content (videos, PDFs, chapters)

All curriculum and video data lives in **one place**, shared by the app and the server:

- `backend/data/curriculum.json` – grades, subjects, chapters, per-chapter videos and PDF links
- `backend/data/videos.json` – the video lecture library

`constants/academicData.ts` and `constants/videoData.ts` import these files, and the backend reads the same files.
Edit the JSON, never a copy.

Check the content before you ship it:

```bash
npm run audit:content          # fast structure checks incl. no video under 5 minutes (runs on every PR)
npm run audit:content:online   # also checks every YouTube video (live, embeddable, real length) and external link
```

A GitHub Action runs the online check every Monday, so videos that disappear are caught early.
Students can report a wrong or broken video from the player; reports are stored in MongoDB
(or in `backend/data/video-reports.jsonl` when the database is offline).

## Deploy (backend + Android app)

The app works offline for course content, but sign-in, saved progress and rankings need the backend and a database. These steps need your own accounts; the config files are already in the repo.

### 1. Database: MongoDB Atlas
1. Create a free cluster at https://www.mongodb.com/atlas.
2. *Database Access*: add a user with a strong password.
3. *Network Access*: allow `0.0.0.0/0` (Render's IPs change).
4. *Connect → Drivers*: copy the connection string, e.g. `mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/mindsprint`.

### 2. Backend: Render
1. On https://render.com choose *New → Blueprint* and select this repository. `render.yaml` creates the `mindsprint-backend` web service (root `backend/`, `node server.js`, health check `/api/health`).
2. Fill the secret values when asked: `MONGO_URI` (from step 1), `GOOGLE_CLIENT_ID_WEB` (step 4), optionally `GEMINI_API_KEY`. `JWT_SECRET` is generated automatically; in production the server refuses to start without one.
3. After the deploy, open `https://<your-service>.onrender.com/api/health`; it should return `{"status":"OK"}`. Courses, videos and papers are seeded into the database on first start.

### 3. Point the app at the backend
Set `EXPO_PUBLIC_API_URL` to `https://<your-service>.onrender.com/api`:
- for builds: edit the `preview` / `production` profiles in `eas.json` (they default to `https://mindsprint-backend.onrender.com/api`);
- for local testing against the deployed server: put it in `.env`.

A non-local `EXPO_PUBLIC_API_URL` always wins; without it the app talks to the dev machine running `node backend/server.js` on port 5000.

### 4. Google sign-in on Android
1. In Google Cloud Console → *APIs & Services → Credentials*, create OAuth client IDs:
   - **Web application**: use its ID for `GOOGLE_CLIENT_ID_WEB` (backend) and `EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB` (app). Android sign-in returns tokens for this audience.
   - **Android**: package name `com.mindsprint.app`, SHA-1 from `eas credentials -p android` (the build keystore). Put the ID in `EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID`.
2. Native Google sign-in needs a development or release build; it does not work inside Expo Go.

### 5. Build an installable APK
```bash
npm install -g eas-cli
eas login
eas init                                   # links the project to your Expo account (adds the projectId)
eas build -p android --profile preview     # shareable .apk
eas build -p android --profile production  # .aab for the Play Store
```

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
