const path = require('path');
const express = require('express');
const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');
const { questions } = require('./questions');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(path.join(__dirname)));

const state = {
  teams: [],
  currentQuestion: 0,
  answers: {},
  phase: 'setup',
  questionLocked: false
};

function broadcastState() {
  const payload = {
    ...state,
    totalQuestions: questions.length,
    correctAnswer: state.questionLocked && state.phase === 'question'
      ? questions[state.currentQuestion].correct
      : null,
    explanation: state.questionLocked && state.phase === 'question'
      ? questions[state.currentQuestion].explanation
      : ''
  };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'state', payload }));
    }
  });
}

function sendState(ws) {
  const payload = {
    ...state,
    totalQuestions: questions.length,
    correctAnswer: state.questionLocked && state.phase === 'question'
      ? questions[state.currentQuestion].correct
      : null,
    explanation: state.questionLocked && state.phase === 'question'
      ? questions[state.currentQuestion].explanation
      : ''
  };
  ws.send(JSON.stringify({ type: 'state', payload }));
}

function scoreAnswers() {
  const correct = questions[state.currentQuestion].correct;
  Object.entries(state.answers).forEach(([teamName, choice]) => {
    if (choice === correct) {
      const team = state.teams.find((t) => t.name === teamName);
      if (team) {
        team.score = (team.score || 0) + 1;
      }
    }
  });
}

function lockQuestionIfNeeded() {
  if (Object.keys(state.answers).length === state.teams.length && state.teams.length > 0) {
    state.questionLocked = true;
    scoreAnswers();
  }
}

wss.on('connection', (ws) => {
  sendState(ws);

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      handleMessage(message);
    } catch (error) {
      // ignore malformed payloads
    }
  });
});

function handleMessage(message) {
  const { type, payload } = message;

  if (type === 'add-team' && state.phase === 'setup') {
    const name = payload.name?.trim();
    if (!name) return;
    const exists = state.teams.some((team) => team.name.toLowerCase() === name.toLowerCase());
    if (exists) return;
    state.teams.push({ name, score: 0 });
    broadcastState();
    return;
  }

  if (type === 'start-quiz' && state.phase === 'setup' && state.teams.length > 0) {
    state.phase = 'question';
    state.currentQuestion = 0;
    state.answers = {};
    state.questionLocked = false;
    broadcastState();
    return;
  }

  if (type === 'answer' && state.phase === 'question' && !state.questionLocked) {
    const { teamName, choice } = payload || {};
    const isTeam = state.teams.some((team) => team.name === teamName);
    if (!isTeam || typeof choice !== 'number') return;
    state.answers[teamName] = choice;
    lockQuestionIfNeeded();
    broadcastState();
    return;
  }

  if (type === 'next-question' && state.phase === 'question' && state.questionLocked) {
    if (state.currentQuestion < questions.length - 1) {
      state.currentQuestion += 1;
      state.answers = {};
      state.questionLocked = false;
    } else {
      state.phase = 'final';
      state.questionLocked = true;
    }
    broadcastState();
    return;
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Quiz running at http://localhost:${PORT}`);
});
