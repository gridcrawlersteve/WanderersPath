let storyData;
let currentTile = { x: 0, y: 0 };
let ttsEnabled = true;

// Load JSON
fetch('story.json')
  .then(response => response.json())
  .then(data => {
    storyData = data;
    showTile(currentTile.x, currentTile.y);
  });

// Toggle TTS
document.getElementById('tts-toggle').addEventListener('click', () => {
  ttsEnabled = !ttsEnabled;
  alert(`Narration ${ttsEnabled ? "enabled" : "disabled"}`);
});

// Web Speech API
function speak(text) {
  if (ttsEnabled && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }
}

// Show tile
function showTile(x, y) {
  const tile = storyData.map[y][x];
  const storyDiv = document.getElementById('story');
  const choicesDiv = document.getElementById('choices');

  // Support day/night/weather description
  let descText = tile.desc.default || "You see nothing special here.";
  storyDiv.textContent = descText;
  speak(descText);

  // If tile has an event, show it
  if (tile.event) {
    showEvent(tile.event);
  }

  // Movement buttons
  choicesDiv.innerHTML = '';
  ['north', 'east', 'south', 'west'].forEach(dir => {
    if (tile[dir]) {
      const btn = document.createElement('button');
      btn.textContent = dir.toUpperCase();
      btn.onclick = () => move(dir);
      choicesDiv.appendChild(btn);
    }
  });
}

// Move function
function move(direction) {
  const tile = storyData.map[currentTile.y][currentTile.x];
  const nextId = tile[direction];

  for (let y = 0; y < storyData.map.length; y++) {
    for (let x = 0; x < storyData.map[y].length; x++) {
      if (storyData.map[y][x].id === nextId) {
        currentTile = { x, y };
        showTile(x, y);
        return;
      }
    }
  }
}

// Display events
function showEvent(event) {
  const choicesDiv = document.getElementById('choices');
  const eventDiv = document.createElement('div');
  eventDiv.style.margin = "1em 0";
  eventDiv.style.padding = "0.5em";
  eventDiv.style.border = "1px solid #888";

  eventDiv.innerHTML = `<strong>${event.name}</strong><br>${event.description}`;
  choicesDiv.appendChild(eventDiv);
  speak(event.description);

  event.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.textContent = choice.text;
    btn.onclick = () => {
      alert(choice.result);
      choicesDiv.removeChild(eventDiv);
    };
    choicesDiv.appendChild(btn);
  });
}
