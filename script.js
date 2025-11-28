const questions = [
  {
    text: "Santa’s email account gets hacked because he used “Santa123” as his password. What is the main issue here?",
    options: [
      "Password is too festive",
      "Password is too short",
      "Password is weak and predictable",
      "Password is not encrypted"
    ],
    correct: 2,
    explanation:
      "Using simple, predictable passwords like “Santa123” makes accounts easy to hack. Strong passwords should be complex and unique."
  },
  {
    text: "Santa receives an email saying “Click here to claim your free sleigh upgrade!” What type of cyber attack is this?",
    options: ["Malware", "Phishing", "Ransomware", "Spoofing"],
    correct: 1,
    explanation:
      "Phishing emails trick users into clicking malicious links or providing sensitive information by pretending to be legitimate offers."
  },
  {
    text: "The elves use public Wi-Fi at the North Pole café to check toy orders. What is the biggest risk?",
    options: ["Slow internet", "Data interception", "Battery drain", "Toy list corruption"],
    correct: 1,
    explanation:
      "Public Wi-Fi is often unsecured, making it easy for attackers to intercept sensitive data like login credentials."
  },
  {
    text: "Santa stores all naughty/nice lists on a USB stick without encryption. What is the risk?",
    options: [
      "USB might freeze",
      "Data loss due to malware",
      "Unauthorized access if lost",
      "Slower toy delivery"
    ],
    correct: 2,
    explanation:
      "Unencrypted USB drives can expose sensitive data if lost or stolen. Encryption protects data even if the device is compromised."
  },
  {
    text: "An elf installs a free “Christmas Countdown” app that secretly steals data. What type of threat is this?",
    options: ["Worm", "Trojan Horse", "Spyware", "Rootkit"],
    correct: 1,
    explanation:
      "A Trojan Horse disguises itself as a legitimate app but contains malicious code that steals or damages data."
  },
  {
    text: "Santa wants to share toy blueprints securely with elves. Which method is best?",
    options: [
      "Email without attachment",
      "Encrypted file transfer",
      "Posting on social media",
      "Sending via SMS"
    ],
    correct: 1,
    explanation:
      "Encrypted file transfer ensures that only authorized recipients can access the sensitive data."
  },
  {
    text: "Santa’s workshop network gets locked and demands payment in Bitcoin. What attack is this?",
    options: ["Phishing", "Ransomware", "DDoS", "Keylogging"],
    correct: 1,
    explanation:
      "Ransomware encrypts files and demands payment for decryption, often in cryptocurrency."
  },
  {
    text: "An elf notices strange activity on Santa’s account after clicking a link. What should they do first?",
    options: ["Ignore it", "Change the password", "Delete the account", "Post about it online"],
    correct: 1,
    explanation:
      "Changing the password immediately helps prevent further unauthorized access and limits damage."
  },
  {
    text: "Santa uses the same password for his email and toy inventory system. What is this called?",
    options: ["Password recycling", "Password hashing", "Password encryption", "Password rotation"],
    correct: 0,
    explanation:
      "Reusing passwords across multiple accounts increases risk—if one account is compromised, others are too."
  },
  {
    text: "Santa wants to ensure his sleigh’s GPS system is safe from hackers. What should he implement?",
    options: ["Strong encryption", "Festive firewall", "Christmas antivirus", "Toy tracker"],
    correct: 0,
    explanation:
      "Encrypting GPS data prevents attackers from intercepting or altering navigation information."
  }
];

const teamForm = document.getElementById("team-form");
const teamNameInput = document.getElementById("team-name");
const teamList = document.getElementById("team-list");

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
const finalScore = document.getElementById("final-score");
const finalMessage = document.getElementById("final-message");
const rewardFlight = document.getElementById("reward-flight");

let teams = [];
let currentQuestion = 0;
let answers = {};
let questionLocked = false;

const letters = ["A", "B", "C", "D"];

teamForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = teamNameInput.value.trim();
  if (!name) return;
  addTeam(name);
  teamNameInput.value = "";
});

nextBtn.addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    resetQuestionState();
    renderQuestion();
  } else {
    showWinners();
  }
});

function addTeam(name) {
  if (teams.length > 0) return;
  teams.push({ name, score: 0 });
  renderTeams();
  startQuiz();
}

function startQuiz() {
  teamSection.classList.add("hidden");
  quizSection.classList.remove("hidden");
  renderQuestion();
}

function renderTeams() {
  teamList.innerHTML = "";
  teams.forEach((team) => {
    const pill = document.createElement("div");
    pill.className = "pill";
    pill.textContent = team.name;
    teamList.appendChild(pill);
  });
}

function resetQuestionState() {
  answers = {};
  questionLocked = false;
  nextBtn.disabled = true;
  explanationBox.classList.add("hidden");
  explanationBox.textContent = "";
}

function renderQuestion() {
  const { text, options, correct } = questions[currentQuestion];
  progressCount.textContent = `${currentQuestion + 1} / ${questions.length}`;
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  progressBarFill.style.width = `${progress}%`;

  questionTitle.textContent = `Question ${currentQuestion + 1}`;
  questionText.textContent = text;

  optionsList.innerHTML = "";
  options.forEach((opt, idx) => {
    const optionEl = document.createElement("div");
    optionEl.className = "option";
    optionEl.innerHTML = `<span class="option__label">${letters[idx]}</span><span>${opt}</span>`;
    if (questionLocked && idx === correct) optionEl.classList.add("correct");
    optionsList.appendChild(optionEl);
  });

  renderTeamAnswerPanels();
}

function renderTeamAnswerPanels() {
  teamsAnswers.innerHTML = "";
  teams.forEach((team) => {
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

    questions[currentQuestion].options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.dataset.team = team.name;
      btn.dataset.choice = idx;
      btn.innerHTML = `<span class="letter">${letters[idx]}</span><span>${opt}</span><span class="ghost">🦌</span>`;
      btn.addEventListener("click", handleTeamChoice);

      if (answers[team.name] === idx) {
        btn.classList.add("selected");
      }

      controls.appendChild(btn);
    });

    wrapper.appendChild(controls);
    teamsAnswers.appendChild(wrapper);
  });
}

function handleTeamChoice(event) {
  if (questionLocked) return;
  const teamName = event.currentTarget.dataset.team;
  const choice = Number(event.currentTarget.dataset.choice);
  answers[teamName] = choice;
  updateSelections();
  if (Object.keys(answers).length === teams.length) {
    revealExplanation();
  }
}

function updateSelections() {
  document.querySelectorAll(".team-controls").forEach((group) => {
    group.querySelectorAll(".option-btn").forEach((btn) => {
      const teamName = btn.dataset.team;
      const selected = answers[teamName];
      btn.classList.toggle("selected", Number(btn.dataset.choice) === selected);
    });
  });
}

function revealExplanation() {
  questionLocked = true;
  const { correct, explanation } = questions[currentQuestion];
  let celebrated = false;

  document.querySelectorAll(".team-answer").forEach((card) => {
    const teamName = card.querySelector(".team-answer__header span:last-child").textContent;
    const chosen = answers[teamName];
    const statusChip = card.querySelector(".status-chip");

    card.querySelectorAll(".option-btn").forEach((btn) => {
      const choice = Number(btn.dataset.choice);
      btn.classList.toggle("correct", choice === correct);
      btn.classList.toggle("incorrect", choice === chosen && chosen !== correct);
    });

    if (chosen === correct) {
      statusChip.textContent = "Correct";
      statusChip.className = "status-chip correct";
      incrementScore(teamName);
      celebrated = true;
    } else {
      statusChip.textContent = "Nice try";
      statusChip.className = "status-chip wrong";
    }
  });

  document.querySelectorAll(".option").forEach((opt, idx) => {
    opt.classList.toggle("correct", idx === correct);
  });

  explanationBox.textContent = explanation;
  explanationBox.classList.remove("hidden");
  nextBtn.textContent = currentQuestion === questions.length - 1 ? "See your results" : "Next question";
  nextBtn.disabled = false;

  if (celebrated) {
    triggerReindeerFlyover();
  }
}

function incrementScore(teamName) {
  const team = teams.find((t) => t.name === teamName);
  if (team) team.score += 1;
}

function triggerReindeerFlyover() {
  if (!rewardFlight) return;
  rewardFlight.classList.remove("is-flying");
  // force reflow to restart animation
  void rewardFlight.offsetWidth;
  rewardFlight.classList.add("is-flying");
  setTimeout(() => {
    rewardFlight.classList.remove("is-flying");
  }, 4200);
}

function showWinners() {
  quizSection.classList.add("hidden");
  winnersSection.classList.remove("hidden");

  const [team] = teams;
  const { score } = team;
  const total = questions.length;
  const remaining = total - score;

  finalScore.textContent = `${team.name} earned ${score} point${score === 1 ? "" : "s"} out of ${total}.`;

  if (remaining === 0) {
    finalMessage.textContent = "Perfect score! Your sleigh is locked down tighter than Santa's cookie jar.";
  } else if (score >= Math.ceil(total * 0.7)) {
    finalMessage.textContent = "Great job! A few more quick checks and the North Pole will be ironclad.";
  } else {
    finalMessage.textContent = "Thanks for playing!";
  }
}
