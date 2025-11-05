let storyData;
let currentTile = { x: 0, y: 0 };

fetch('story.json')
  .then(response => response.json())
  .then(data => {
    storyData = data;
    showTile(currentTile.x, currentTile.y);
  });

function showTile(x, y) {
  const tile = storyData.map[y][x];
  const storyDiv = document.getElementById('story');
  const choicesDiv = document.getElementById('choices');

  storyDiv.textContent = tile.desc;
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
