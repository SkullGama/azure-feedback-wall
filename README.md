# Azure Feedback Wall

A small “feedback wall” web app meant to be deployed on **Azure Static Web Apps** with a serverless **Azure Functions** API.

This repo is split into a frontend (`src/`) and an API (`api/`) and includes a GitHub Actions workflow for deployment.

---

## What you can do with it

- Post feedback (think short notes/cards).
- View the feedback wall in the browser.
- Run locally for development, then deploy to Azure Static Web Apps.

> Note: The exact UI/fields/storage behavior depends on the code in `src/` and `api/`.

---

## Tech stack (at a glance)

- Frontend: JavaScript/HTML/CSS in `src/`
- Backend: Azure Functions (serverless API) in `api/`
- CI/CD: GitHub Actions in `.github/workflows/`

---

## Project structure

```text
.
├─ api/                  # Azure Functions API (serverless)
├─ src/                  # Frontend app
└─ .github/workflows/    # GitHub Actions deployment pipeline
