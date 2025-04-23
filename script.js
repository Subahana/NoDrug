
// Fact Generator
const facts = [
  "Drug abuse can shrink your brain faster than a phone battery on 1%.",
  "Teens who stay clean are 5x more likely to achieve their goals. 💯",
  "Addiction is a trap dressed like a trend. Don’t fall for it.",
  "Drugs mess with your dopamine like a bad WiFi signal.",
  "Your future self will thank you for saying nope to dope."
];

function showFact() {
  const factText = document.querySelector(".story-box.active p") || document.createElement("p");
  const randomIndex = Math.floor(Math.random() * facts.length);
  factText.textContent = facts[randomIndex];
  factText.focus();
}

// Hamburger Menu
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("show");
  const hamburger = document.querySelector(".hamburger");
  hamburger.setAttribute("aria-expanded", nav.classList.contains("show"));
}

// Typed-Text Effect
const phrases = [
  "Join the fight against addiction.",
  "Save your life, save your future.",
  "Sober is the new savage.",
  "Say nope to dope!"
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedText = document.getElementById("typed-text");

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];
  if (!isDeleting) {
    typedText.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1500);
      return;
    }
  } else {
    typedText.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeEffect, isDeleting ? 50 : 100);
}

if (typedText) {
  setTimeout(typeEffect, 500);
}

// Stats Counter
function animateCounter(element, target, suffix = "") {
  let count = 0;
  const increment = target / 100;
  const interval = setInterval(() => {
    count += increment;
    if (count >= target) {
      count = target;
      clearInterval(interval);
    }
    element.textContent = Math.round(count) + suffix;
  }, 20);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll(".stats-grid span").forEach(span => {
        const target = parseInt(span.dataset.count);
        const suffix = span.dataset.count.includes("%") ? "%" : span.dataset.count.includes("B") ? "B" : "";
        animateCounter(span, target, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelector(".stats-section").classList.add("animate-stats");
statsObserver.observe(document.querySelector(".stats-section"));

// Stories Carousel
const stories = document.querySelectorAll(".story-box");
let currentStory = 0;

function showStory(index) {
  stories.forEach((story, i) => {
    story.classList.toggle("active", i === index);
  });
}

document.querySelector(".prev-story")?.addEventListener("click", () => {
  currentStory = (currentStory - 1 + stories.length) % stories.length;
  showStory(currentStory);
});

document.querySelector(".next-story")?.addEventListener("click", () => {
  currentStory = (currentStory + 1) % stories.length;
  showStory(currentStory);
});

// Meme Generator
const memeImageInput = document.getElementById("memeImage");
const memeTextInput = document.getElementById("memeText");
const generateMemeBtn = document.getElementById("generateMemeBtn");
const downloadMemeBtn = document.getElementById("downloadMemeBtn");
const shareMemeBtn = document.getElementById("shareMemeBtn");
const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");

function drawMeme(image, text) {
  canvas.width = 400;
  canvas.height = 400;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw image
  if (image) {
    const aspectRatio = image.width / image.height;
    let drawWidth = canvas.width;
    let drawHeight = canvas.width / aspectRatio;
    if (drawHeight > canvas.height) {
      drawHeight = canvas.height;
      drawWidth = canvas.height * aspectRatio;
    }
    ctx.drawImage(image, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight);
  }

  // Draw text
  ctx.font = "bold 24px Poppins";
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  const maxWidth = canvas.width - 20;
  const words = text.split(" ");
  let line = "";
  let lines = [];
  let y = canvas.height - 10;

  for (let word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== "") {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  for (let i = lines.length - 1; i >= 0; i--) {
    ctx.strokeText(lines[i], canvas.width / 2, y);
    ctx.fillText(lines[i], canvas.width / 2, y);
    y -= 30;
  }
}

memeImageInput.addEventListener("change", () => {
  const file = memeImageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => drawMeme(img, memeTextInput.value || "Say Nope to Dope!");
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

memeTextInput.addEventListener("input", () => {
  const img = new Image();
  img.src = canvas.toDataURL();
  img.onload = () => drawMeme(img, memeTextInput.value || "Say Nope to Dope!");
});

generateMemeBtn.addEventListener("click", () => {
  const img = new Image();
  img.src = canvas.toDataURL();
  img.onload = () => drawMeme(img, memeTextInput.value || "Say Nope to Dope!");
  downloadMemeBtn.disabled = false;
  shareMemeBtn.disabled = false;
});

downloadMemeBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "say-nope-to-dope-meme.png";
  link.click();
});

shareMemeBtn.addEventListener("click", () => {
  if (navigator.share) {
    canvas.toBlob(blob => {
      const file = new File([blob], "meme.png", { type: "image/png" });
      navigator.share({
        files: [file],
        title: "Say Nope to Dope Meme",
        text: "Check out my anti-drug meme from Say Nope to Dope! 🚫"
      }).catch(console.error);
    });
  } else {
    alert("Sharing not supported. Download and share manually!");
  }
});

// Form Validation
document.getElementById("joinForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const emailInput = e.target.querySelector("input[type='email']");
  const email = emailInput.value.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const successMsg = e.target.querySelector(".form-success");
    successMsg.hidden = false;
    successMsg.classList.add("visible");
    emailInput.value = "";
    setTimeout(() => {
      successMsg.hidden = true;
      successMsg.classList.remove("visible");
    }, 3000);
  } else {
    alert("Please enter a valid email address.");
    emailInput.focus();
  }
});

// Close Menu on Link Click
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    const nav = document.getElementById("navLinks");
    if (nav.classList.contains("show")) {
      nav.classList.remove("show");
      document.querySelector(".hamburger").setAttribute("aria-expanded", "false");
    }
  });
});
