# PolAI

PolAI analyzes text for United States political bias. It highlights biased
passages and suggests neutral wording.

## Architecture

The client uses React, TypeScript, and Vite. GitHub Pages can host the client.

The API uses Express and MongoDB. Vercel can host the API.

The API sends each submission to `gpt-5.6-luna` through the OpenAI Responses
API. A strict JSON schema controls the response.

## Requirements

- Node.js 22.12 or later
- A MongoDB database
- An OpenAI API key with access to `gpt-5.6-luna`

## Configure the project

1. Copy `client/.env.example` to `client/.env`.
2. Set `VITE_API_BASE_URL` to the API address.
3. Copy `server/.env.example` to `server/.env`.
4. Set `OPENAI_API_KEY` and `MONGO_URI` in `server/.env`.
5. Set `CLIENT_ORIGIN` to the client address.

Do not commit either `.env` file.

## Install dependencies

Run this command from the repository root:

```powershell
npm run install:all
```

## Run the project

Run the API in the first terminal:

```powershell
npm run dev:server
```

Run the client in the second terminal:

```powershell
npm run dev:client
```

Open `http://localhost:5173/polai/`.

## Check the project

Run all static checks and tests:

```powershell
npm run check
```

The full API flow also needs valid MongoDB and OpenAI credentials.
