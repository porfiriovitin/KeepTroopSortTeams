let players = [];
let isBulkMode = false;

function addPlayer() {
  const playerNameInput = document.getElementById("playerName");
  const playerName = playerNameInput.value.trim();

  if (playerName && !players.includes(playerName)) {
    players.push(playerName);
    playerNameInput.value = "";
    updatePlayersList();
  } else if (players.includes(playerName)) {
    alert("Este jogador já foi adicionado!");
  }
}

function removePlayer(index) {
  players.splice(index, 1);
  updatePlayersList();
}

function updatePlayersList() {
  const playersList = document.getElementById("playersList");
  playersList.innerHTML = "";

  players.forEach((player, index) => {
    const playerTag = document.createElement("div");
    playerTag.className = "player-tag";
    playerTag.innerHTML = `
      <span>${player}</span>
      <button class="remove-player" onclick="removePlayer(${index})">×</button>
    `;
    playersList.appendChild(playerTag);
  });

  const sortBtn = document.getElementById("sortBtn");
  if (players.length > 0) {
    sortBtn.classList.remove("hidden");
  } else {
    sortBtn.classList.add("hidden");
  }
}


function toggleInputMode() {
  const singleInput = document.getElementById("singleInput");
  const bulkInput = document.getElementById("bulkInput");
  const toggleBtn = document.getElementById("toggleInputBtn");

  isBulkMode = !isBulkMode;

  if (isBulkMode) {
    singleInput.classList.add("hidden");
    bulkInput.classList.add("active");
    toggleBtn.textContent = "Adicionar individualmente";
  } else {
    singleInput.classList.remove("hidden");
    bulkInput.classList.remove("active");
    toggleBtn.textContent = "Inserir Lista Completa";
  }
}

function processBulkInput() {
  const bulkText = document.getElementById("bulkPlayers").value.trim();
  if (!bulkText) return;

  const lines = bulkText.split("\n");
  const newPlayers = [];

  lines.forEach((line) => {
    line = line.trim();
    if (line) {
      let playerName = line
        .replace(/^\d+[-.\s]+/, "")
        .replace(/^[-*]\s*/, "")
        .trim();
      if (playerName && !players.includes(playerName)) {
        newPlayers.push(playerName);
      }
    }
  });

  players = players.concat(newPlayers);
  document.getElementById("bulkPlayers").value = "";
  updatePlayersList();

}

function sortTeams() {
  const numPlayers = parseInt(document.getElementById("numPlayers").value);
  const numTeams = parseInt(document.getElementById("numTeams").value);

  if (players.length < numPlayers) {
    alert(
      `Você precisa adicionar pelo menos ${numPlayers} jogadores para realizar o sorteio!`
    );
    return;
  }

  if (numTeams <= 0 || numPlayers <= 0) {
    alert(
      "Por favor, insira valores válidos para quantidade de jogadores e times!"
    );
    return;
  }

  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);

  const selectedPlayers = shuffledPlayers.slice(0, numPlayers);

  const teams = [];
  const playersPerTeam = Math.floor(numPlayers / numTeams);
  const remainingPlayers = numPlayers % numTeams;

  let playerIndex = 0;

  for (let i = 0; i < numTeams; i++) {
    const team = [];
    const teamSize = playersPerTeam + (i < remainingPlayers ? 1 : 0);

    for (let j = 0; j < teamSize; j++) {
      team.push(selectedPlayers[playerIndex]);
      playerIndex++;
    }

    teams.push(team);
  }

  displayTeams(teams);
}

function displayTeams(teams) {
  const teamsResult = document.getElementById("teamsResult");
  const teamsGrid = document.getElementById("teamsGrid");
  const sortBtn = document.getElementById("sortBtn");
  const resortBtn = document.getElementById("resortBtn");

  teamsGrid.innerHTML = "";

  teams.forEach((team, index) => {
    const teamCard = document.createElement("div");
    teamCard.className = "team-card";

    const teamTitle = document.createElement("div");
    teamTitle.className = "team-title";
    teamTitle.textContent = `Time ${index + 1}`;

    const teamMembers = document.createElement("ul");
    teamMembers.className = "team-members";

    team.forEach((player) => {
      const memberItem = document.createElement("li");
      memberItem.textContent = player;
      teamMembers.appendChild(memberItem);
    });

    teamCard.appendChild(teamTitle);
    teamCard.appendChild(teamMembers);
    teamsGrid.appendChild(teamCard);
  });

  teamsResult.classList.remove("hidden");
  sortBtn.classList.add("hidden");
  resortBtn.classList.remove("hidden");
}


document
  .getElementById("playerName")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addPlayer();
    }
  });

document
  .getElementById("bulkPlayers")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter" && e.ctrlKey) {
      processBulkInput();
    }
  });
