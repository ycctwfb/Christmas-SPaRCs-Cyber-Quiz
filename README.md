# Christmas SPaRCs Cyber Quiz

A festive, in-browser cyber security quiz built for team meetings. Add team names, answer together, reveal explanations after everyone has picked, and celebrate the top three on a podium. Now the quiz stays in sync across everyone’s devices.

## Getting started (live, shared session)
1. Install dependencies: `npm install`.
2. Run the live quiz server: `npm start` (defaults to port 3000). The page and WebSocket sync server run together.
3. Share your machine’s LAN IP and port (e.g., `http://192.168.1.10:3000`) so teammates can join from their phones/laptops on the same network.
4. Add team names, start the quiz, and let each team choose an answer for every question. All answers and explanations stay synchronized for everyone.
5. Explanations appear after all teams have responded, and scores automatically roll into the 1st/2nd/3rd place podium at the end.
