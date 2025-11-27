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

if (typeof module !== "undefined") {
  module.exports = { questions };
}

if (typeof window !== "undefined") {
  window.questions = questions;
}
