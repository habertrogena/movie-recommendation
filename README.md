# 🎬 Movie Recommendation App

A simple movie recommendation application built with **Next.js, TypeScript, Tailwind, ShadCN UI, React Query, and Firebase Authentication**.

This project is part of the **Savannah Informatics Web Developer Assessment**. It demonstrates modern frontend practices: API integration, state management, authentication, testing, CI/CD, and deployment.

---

## 🚀 Features

- 📺 **Movie List** → Browse popular movies with title, poster & overview.
- 🎥 **Movie Details** → View cast, crew, ratings & description of a movie.
- 🔍 **Search** → Find movies by title/keyword.
- 📄 **Pagination** → Navigate through multiple pages of movies.
- ⏳ **Loaders** → Skeletons/spinners while data loads.
- 🔑 **Authentication** → Simple login and signup with Firebase (Google/Email).
- 🧪 **Testing** → Unit tests with Jest & React Testing Library.
- ⚡ **CI/CD** → GitHub Actions (lint + tests) & deployment on Vercel.

✨ Bonus:

- 🎯 Recommendations (similar movies from the movie api)
- 🎨 Figma Wireframes & smooth animations

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Turbopack, TypeScript)
- **Styling:** Tailwind CSS + ShadCN UI
- **State/Data:** React Query/tanstack query
- **Auth:** Firebase Authentication
- **Testing:** Jest + React Testing Library
- **Deployment:** Vercel + GitHub Actions

---

## 🌱 Git Workflow

- `main` → production (stable release)
- `develop` → integration branch
- `feature/*` → feature branches (movie-list, search, auth, etc.)

✅ Conventional commit messages:

```bash
feat(movie-list): add movie list with posters
fix(api): handle empty search results
chore(ci): configure GitHub Actions pipeline
```

## 🌍 Live Demo

👉 [Movie Recommendation App on Vercel](https://movie-recommendation-five-beta.vercel.app/)

## ⚙️ Getting Started (Run Locally)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/habertrogena/movie-recommendation.git
cd movie-recommendation-app
```

### Install dependencies

pnpm install

### Configure environment variables

Create a .env.local file in the root directory:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_MOVIE_API_KEY=your_tmdb_api_key
```

🔑 Get credentials from Firebase Console
and a TMDB API key

### Run the development server

pnpm dev

### Run tests

pnpm test

## Deployment

This project is deployed with Vercel.

Push your repo to GitHub

Connect the repo to Vercel

Add your environment variables under Project Settings → Environment Variables

Deploy

## API Reference

This project uses The Movie Database (TMDB) API.

TMDB Docs

Example endpoints:
GET /movie/popular
GET /search/movie?query=keyword
GET /movie/{movie_id}
GET /movie/{movie_id}/recommendations

## Roadmap / Future Improvements

Improve mobile responsiveness

Add dark mode

User favorites

User reviews & ratings

Analytics for trending movies

## Contributing

Contributions are welcome!

Fork the repo

Create a feature branch: git checkout -b feature/your-feature

Commit your changes: git commit -m "feat: add your feature"

Push to your fork: git push origin feature/your-feature

Open a Pull Request

## Author

Habert Rogena – https://github.com/habertrogena
