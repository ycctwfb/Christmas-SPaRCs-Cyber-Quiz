# Christmas SPaRCs Cyber Quiz

A festive, in-browser cyber security quiz built for team meetings. Add team names, answer together, reveal explanations after everyone has picked, and celebrate the top three on a podium. Now the quiz stays in sync across everyone’s devices.

## Getting started (live, shared session)
1. Install dependencies: `npm install`.
2. Run the live quiz server: `npm start` (defaults to port 3000). The page and WebSocket sync server run together.
3. Share your machine’s LAN IP and port (e.g., `http://192.168.1.10:3000`) so teammates can join from their phones/laptops on the same network.
4. Add team names, start the quiz, and let each team choose an answer for every question. All answers and explanations stay synchronized for everyone.
5. Explanations appear after all teams have responded, and scores automatically roll into the 1st/2nd/3rd place podium at the end.

## Hosting over the internet (easiest option for restrictive Wi‑Fi)
If your office Wi‑Fi blocks device-to-device traffic, deploy the quiz to a hosted Node service so everyone joins via HTTPS:

### One-click Render deployment
1. Create a free Render account.
2. Click “New +” → “Web Service”, pick this repo (or your fork), and confirm Node as the runtime. Render will read `render.yaml` for defaults.
3. Build command: `npm install` (default). Start command: `npm start`.
4. Render sets `PORT` automatically—no code changes needed. Once live, share the Render URL (e.g., `https://your-quiz.onrender.com`) with your team.

### Manual deploy from a zipped copy
1. Zip this repo and upload it as a new Render Web Service (or any Heroku/Glitch/Railway-style Node host).
2. Use the same build/start commands above and let the host supply the `PORT` environment variable.
3. Open the HTTPS URL the host provides and share it with your teammates.
