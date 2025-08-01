var topics = [];
var selectedTopic = null;
var wordRows = [];
var fields = ["english", "vietnamese", "note"]

function showNotification(message = "Saved successfully ✅", type = "success") {
  const box = document.getElementById("notification");

  box.textContent = message;
  box.className = ""; // clear existing classes
  box.classList.add("show", type); // add "show" and "success" or "error"

  setTimeout(() => {
    box.classList.remove("show", type);
  }, 1000);
}


async function loadTopics() {
  const res = await fetch("/topics/");
  topics = await res.json();
  const list = document.getElementById("topicList");
  list.innerHTML = "";
  topics.forEach(t => {
    const btn = document.createElement("button");
    btn.textContent = t.name;
    btn.onclick = () => showTopic(t);
    list.appendChild(btn);
  });
  if (topics.length >0 ) {
    selectedTopic = topics[0]
    showTopic(topics[0])
  }
}

async function addTopic() {
    const input = document.getElementById("newTopicInput");
    const name = input.value.trim().toUpperCase();
    console.log(JSON.stringify({ name }))
    if (!name) return;

    await fetch("/topics/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    });
    await loadTopics();
}

function showTopic(topic) {
  selectedTopic = topic;
  document.getElementById("selectedTopicTitle").innerText = topic.name;
  loadWords();
}

async function loadWords() {
  const res = await fetch("/words"); // You may need to implement a custom API
  const allWords = await res.json();
  const words = allWords.filter(w => w.topic_id === selectedTopic.id);
  const tbody = document.querySelector("#wordTable tbody");
  tbody.innerHTML = "";
  wordRows = [];

  words.forEach((word, idx) => {
    const tr = createEditableRow(idx + 1, word);
    tbody.appendChild(tr);
    wordRows.push({ element: tr, data: word });
  });
}

function createTd(text, field) {
  const td = document.createElement("td");
  td.textContent = text || "";
  td.dataset.field = field;
  td.dataset.edited = "false"
  td.ondblclick = () => {
    let prev = td.textContent.trim()

    td.contentEditable = "true";
    td.focus();

    td.onblur = () => {
      td.contentEditable = "false";
      if (td.textContent.trim() !== prev) {
        td.dataset.edited = "true"
      }
    }
    td.onkeydown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        td.blur();
      }
    };
  };
  return td
}

function createEditableRow(index, word) {
  const tr = document.createElement("tr");

  const tdNum = document.createElement("td");
  tdNum.textContent = index;
  tdNum.classList.add("number-cell");
  tdNum.onclick = () => tr.classList.toggle("selected");
  tr.appendChild(tdNum);

  fields.forEach(field => {
    // const td = document.createElement("td");
    // td.contentEditable = "false";
    // td.textContent = word[field] || "";
    // td.dataset.field = field;
    const td = createTd(word[field], field)
    tr.appendChild(td);
  });

  tr.dataset.id = word.id;
  return tr;
}

function addRow() {
  const tbody = document.querySelector("#wordTable tbody");
  const newRow = document.createElement("tr");

  const tdNum = document.createElement("td");
  tdNum.textContent = "#";
  newRow.appendChild(tdNum);

  fields.forEach(f => {
    // const td = document.createElement("td");
    // td.contentEditable = "false";
    // td.dataset.field = f;

    const td = createTd("", f)
    newRow.appendChild(td);
  });

  newRow.dataset.new = "true";
  tbody.appendChild(newRow);
  newRow.scrollIntoView({ behavior: "smooth" });
}

async function saveChanges() {
  const rows = document.querySelectorAll("#wordTable tbody tr");
  for (const row of rows) {
    const isNew = row.dataset.new === "true";
    const id = row.dataset.id;
    const tds = row.querySelectorAll("td");
    let isEdited = false

    if (row.classList.contains("selected")) {
      console.log('delete')
      await fetch(`/words/${id}`, { method: "DELETE" });
      continue
    }

    for (let td of tds) {
      if (td.dataset.edited === "true") {
        isEdited = true
        break
      }
    }

    const data = {};
    tds.forEach(td => {
      data[td.dataset.field] = td.textContent.trim();
    });
    
    if (!data.english) continue;

    if (isNew) {
      await fetch("/words/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, topic_id: selectedTopic.id })
      });
    } else if (isEdited) {
      await fetch(`/words/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    }

    showNotification("Saved successfully ✅", "success");
  }
  await loadWords();
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === "A") {
    e.preventDefault();
    addRow();
  } else if (e.ctrlKey && e.shiftKey && e.key === "S") {
    e.preventDefault();
    saveChanges();
  }
  //  else if (e.key === "Delete") {
  //   const selected = document.querySelector("tr.selected");
  //   if (selected) {
  //     selected.classList.add("deleted");
  //     selected.style.textDecoration = "line-through";
  //   }
  // }
});

function goToExercise() {
  window.location.href = "/static/exercise.html";
}

window.onload = loadTopics;
