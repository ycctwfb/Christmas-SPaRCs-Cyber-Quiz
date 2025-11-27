import './questions.js';

const questions = window.questions || [];

const teamForm = document.getElementById("team-form");
const teamNameInput = document.getElementById("team-name");
const teamList = document.getElementById("team-list");
const startBtn = document.getElementById("start-btn");

const quizSection = document.getElementById("quiz-section");
const teamSection = document.getElementById("team-section");
const winnersSection = document.getElementById("winners-section");
const questionTitle = document.getElementById("question-title");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options-list");
const teamsAnswers = document.getElementById("teams-answers");
const explanationBox = document.getElementById("explanation");
const nextBtn = document.getElementById("next-btn");
const progressCount = document.getElementById("progress-count");
const progressBarFill = document.getElementById("progress-bar-fill");
const podium = document.getElementById("podium");
const scoreboard = document.getElementById("scoreboard");

const letters = ["A", "B", "C", "D"];
const protocol = window.location.protocol === "https:" ? "wss" : "ws";
const socket = new WebSocket(`${protocol}://${window.location.host}`);

let quizState = {
  teams: [],
  currentQuestion: 0,
  answers: {},
  phase: "setup",
  questionLocked: false,
  correctAnswer: null,
  explanation: ""
};

socket.addEventListener("open", () => {
  startBtn.disabled = quizState.teams.length === 0;
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.type === "state") {
    quizState = message.payload;
    renderFromState();
  }
});

socket.addEventListener("close", () => {
  startBtn.disabled = true;
  nextBtn.disabled = true;
});

teamForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = teamNameInput.value.trim();
  if (!name) return;
  send({ type: "add-team", payload: { name } });
  teamNameInput.value = "";
});

startBtn.addEventListener("click", () => {
  send({ type: "start-quiz" });
});

nextBtn.addEventListener("click", () => {
  send({ type: "next-question" });
});

function send(message) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

function renderFromState() {
  renderTeams();
  progressCount.textContent = `${Math.min(quizState.currentQuestion + 1, questions.length)} / ${questions.length}`;
  progressBarFill.style.width = `${Math.min(((quizState.currentQuestion + 1) / questions.length) * 100, 100)}%`;

  if (quizState.phase === "setup") {
    teamSection.classList.remove("hidden");
    quizSection.classList.add("hidden");
    winnersSection.classList.add("hidden");
    startBtn.disabled = quizState.teams.length === 0 || socket.readyState !== WebSocket.OPEN;
    return;
  }

  if (quizState.phase === "question") {
    teamSection.classList.add("hidden");
    winnersSection.classList.add("hidden");
    quizSection.classList.remove("hidden");
    renderQuestion();
    return;
  }

  if (quizState.phase === "final") {
    teamSection.classList.add("hidden");
    quizSection.classList.add("hidden");
    winnersSection.classList.remove("hidden");
    showWinners();
  }
}

function renderTeams() {
  teamList.innerHTML = "";
  quizState.teams.forEach((team) => {
    const pill = document.createElement("div");
    pill.className = "pill";
    pill.textContent = team.name;
    teamList.appendChild(pill);
  });
}

function renderQuestion() {
  const { text, options, correct, explanation } = questions[quizState.currentQuestion];
  questionTitle.textContent = `Question ${quizState.currentQuestion + 1}`;
  questionText.textContent = text;

  optionsList.innerHTML = "";
  options.forEach((opt, idx) => {
    const optionEl = document.createElement("div");
    optionEl.className = "option";
    optionEl.innerHTML = `<span class="option__label">${letters[idx]}</span><span>${opt}</span>`;
    if (quizState.questionLocked && idx === correct) optionEl.classList.add("correct");
    optionsList.appendChild(optionEl);
  });

  renderTeamAnswerPanels(correct, explanation);
  const isLast = quizState.currentQuestion === questions.length - 1;
  nextBtn.textContent = isLast ? "See the podium" : "Next question";
  nextBtn.disabled = !quizState.questionLocked;

  explanationBox.textContent = explanation;
  explanationBox.classList.toggle("hidden", !quizState.questionLocked);
}

function renderTeamAnswerPanels(correct, explanation) {
  teamsAnswers.innerHTML = "";
  quizState.teams.forEach((team) => {
    const wrapper = document.createElement("div");
    wrapper.className = "team-answer";

    const header = document.createElement("div");
    header.className = "team-answer__header";
    const chip = document.createElement("span");
    chip.className = "status-chip ready";
    chip.textContent = "Waiting";

    const name = document.createElement("span");
    name.textContent = team.name;

    header.append(chip, name);
    wrapper.appendChild(header);

    const controls = document.createElement("div");
    controls.className = "team-controls";

    questions[quizState.currentQuestion].options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.dataset.team = team.name;
      btn.dataset.choice = idx;
      btn.disabled = quizState.questionLocked;
      btn.innerHTML = `<span class="letter">${letters[idx]}</span><span>${opt}</span><span class="ghost">🦌</span>`;
      btn.addEventListener("click", handleTeamChoice);

      if (quizState.answers[team.name] === idx) {
        btn.classList.add("selected");
      }

      if (quizState.questionLocked) {
        const chosen = quizState.answers[team.name];
        btn.classList.toggle("correct", idx === correct);
        btn.classList.toggle("incorrect", idx === chosen && chosen !== correct);
      }

      controls.appendChild(btn);
    });

    const chosen = quizState.answers[team.name];
    if (quizState.questionLocked && typeof chosen === "number") {
      chip.textContent = chosen === correct ? "Correct" : "Nice try";
      chip.className = `status-chip ${chosen === correct ? "correct" : "wrong"}`;
    } else if (typeof chosen === "number") {
      chip.textContent = "Locked in";
      chip.className = "status-chip ready";
    }

    wrapper.appendChild(controls);
    teamsAnswers.appendChild(wrapper);
  });
}

function handleTeamChoice(event) {
  const teamName = event.currentTarget.dataset.team;
  const choice = Number(event.currentTarget.dataset.choice);
  send({ type: "answer", payload: { teamName, choice } });
}

function showWinners() {
  const standings = [...quizState.teams].sort((a, b) => b.score - a.score);
  const medals = ["🥇", "🥈", "🥉"];

  podium.innerHTML = "";
  standings.slice(0, 3).forEach((team, idx) => {
    const spot = document.createElement("div");
    spot.className = "podium__spot";
    const place = ["1st", "2nd", "3rd"][idx];
    spot.innerHTML = `<div class="medal">${medals[idx] ?? "🎁"}</div><h3>${place} place</h3><p>${team.name}</p><p>${team.score} point${team.score === 1 ? "" : "s"}</p>`;
    podium.appendChild(spot);
  });

  scoreboard.innerHTML = "";
  standings.forEach((team, idx) => {
    const row = document.createElement("div");
    row.className = "score-row";
    row.innerHTML = `<span>${idx + 1}. ${team.name}</span><span>${team.score} / ${questions.length}</span>`;
    scoreboard.appendChild(row);
  });
}
