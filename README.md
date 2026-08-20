# RB Charity Foundation

A MERN-stack charity platform for RB Charity Foundation, built in the same technology family used during the original project period.

## Stack

- React 18
- Vite
- Tailwind CSS
- Node.js
- Express.js
- MongoDB / Mongoose

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

Frontend: `http://localhost:5173`  
API: `http://localhost:5000`

The Vite dev server proxies `/api` requests to the Express server.

## Current V1

- Responsive charity homepage
- RB Group → Foundation → Impact positioning
- Cause categories
- Transparency section
- Stories placeholders for verified future content
- Volunteer / partner / donor pathways
- Donation UI prototype
- Express API foundation
- MongoDB donation model and routes

Payment collection is intentionally disabled until verified foundation banking, compliance and payment-gateway details are configured. No fake impact numbers or certifications are published.
