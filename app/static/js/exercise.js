let currentWord = null;

function goToHome() {
  window.location.href = "/static/index.html";
}
async function fetchTopics() {
  const res = await fetch("/topics/");
  const topics = await res.json();
  const container = document.getElementById("topicList");

  topics.forEach((t, i) => {
    const label = document.createElement("label");
    label.style.display = "block";
    label.style.marginBottom = "6px";
    label.style.cursor = "pointer";

    const checkbox = document.createElement("input");
    if (i === 0) {
        checkbox.checked = true;
    }
    checkbox.type = "checkbox";
    checkbox.value = t.id;
    checkbox.name = "topic";

    label.appendChild(checkbox);
    label.append(" " + t.name);
    container.appendChild(label);
  });
}

async function startExercise() {
    const selected = Array.from(document.querySelectorAll('input[name="topic"]:checked'))
                      .map(cb => Number(cb.value));
    if (!selected.length) return alert("Please select at least one topic.");

    const res = await fetch("/exercise/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected)
    });

    if (!res.ok) return alert("No word found.");
    currentWord = await res.json();

    const chat = document.getElementById("chatBox");
    const sysMsg = document.createElement("div");
    sysMsg.className = "message system";
    sysMsg.innerHTML = `<strong>👉</strong> <span class="note" data-note="${currentWord.note || 'No note'}">${currentWord.vietnamese}</span>`;
    chat.appendChild(sysMsg);
    chat.scrollTop = chat.scrollHeight;
}

function submitAnswer() {
    const input = document.getElementById("userInput");
    const answer = input.value.trim();
    if (!answer || !currentWord) return;

    const chat = document.getElementById("chatBox");

    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.innerHTML = `<strong>🧑</strong> ${answer}<br><br><strong>💡</strong>${currentWord.english}`;
    chat.appendChild(userMsg);

    input.value = "";
    currentWord = null;

    startExercise();
}

fetchTopics();
document.getElementById("userInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    submitAnswer();
  }
});

