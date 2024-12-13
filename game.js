const die1 = document.querySelector("#die1");
const die2 = document.querySelector("#die2");
const startButton = document.querySelector("#start-btn");
const rollButton = document.querySelector("#roll-dice");
const individualButton = document.querySelector("#individual-dice");
const sumButton = document.querySelector("#sum-dice");
const endTurnButton = document.querySelector("#end-turn");
const player1Input = document.querySelector("#player1");
const player2Input = document.querySelector("#player2");
const roundElement = document.querySelector("#round");
const currentTurnElement = document.querySelector("#current-turn");
const diceSumElement = document.querySelector("#dice-sum");
const boxes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let currentPlayer;
let currentRound;
let die1Value;
let die2Value;
let player1Score = 0;
let player2Score = 0;

startButton.addEventListener("click", () => {
  const player1Name = player1Input.value.trim();
  const player2Name = player2Input.value.trim();

  if (!player1Name || !player2Name) {
    alert("Both players must enter their names!");
    player1Input.focus();
    return;
  }

  currentPlayer = 1;
  currentRound = 1;
  currentTurnElement.textContent = `It's ${player1Name}'s turn!`;
  roundElement.textContent = `Round: ${currentRound}`;
  rollButton.disabled = false;

  document.querySelector(".board").style.display = "block";
  document.querySelector(".dice").style.display = "block";
  document.querySelector(".scorecard").style.display = "block";
  document.querySelector(".players").style.display = "none";
  document.querySelector(".winner").style.display = "none";
});

rollButton.addEventListener("click", () => {
  die1Value = Math.floor(Math.random() * 6) + 1;
  die2Value = Math.floor(Math.random() * 6) + 1;

  die1.className = `bi bi-dice-${die1Value}`;
  die2.className = `bi bi-dice-${die2Value}`;

  const diceSum = die1Value + die2Value;
  diceSumElement.textContent = `Sum of Dice: ${diceSum}`;

  const isDie1Shut = boxes[die1Value] === "X";
  const isDie2Shut = boxes[die2Value] === "X";
  const isSumShut = boxes[diceSum] === "X";

  individualButton.disabled = die1Value === die2Value || isDie1Shut || isDie2Shut;
  sumButton.disabled = diceSum > 9 || isSumShut;
  endTurnButton.disabled = !individualButton.disabled || !sumButton.disabled;

  rollButton.disabled = true;
});

function shut(boxNumber) {
  const boxElement = document.querySelector(`#box${boxNumber}`);
  if (boxElement) {
    boxElement.classList.add("shut");
    boxElement.textContent = "X";
  }
}

individualButton.addEventListener("click", () => {
  shut(die1Value);
  shut(die2Value);
  boxes[die1Value] = "X";
  boxes[die2Value] = "X";

  const diceSum = die1Value + die2Value;
  boxes[0] += diceSum;

  individualButton.disabled = true;
  sumButton.disabled = true;
  rollButton.disabled = false;
});

sumButton.addEventListener("click", () => {
  const diceSum = die1Value + die2Value;
  shut(diceSum);
  boxes[diceSum] = "X";
  boxes[0] += diceSum;

  individualButton.disabled = true;
  sumButton.disabled = true;
  rollButton.disabled = false;
});

endTurnButton.addEventListener("click", () => {
  const pointsForTurn = 45 - boxes[0];

  if (currentPlayer === 1) {
    player1Score += pointsForTurn;

    function buildRow(round, p1Points) {
      const row = document.createElement("tr");
      row.id = `round${round}`;

      const th = document.createElement("th");
      th.textContent = `Round ${round}`;
      row.appendChild(th);

      const player1Cell = document.createElement("td");
      player1Cell.className = "p1Pts";
      player1Cell.textContent = p1Points;
      row.appendChild(player1Cell);

      const player2Cell = document.createElement("td");
      player2Cell.className = "p2Pts";
      row.appendChild(player2Cell);

      return row;
    }

    const tableBody = document.querySelector("tbody");
    const newRow = buildRow(currentRound, pointsForTurn);
    tableBody.insertAdjacentElement("beforeend", newRow);

    currentPlayer = 2;
    currentTurnElement.textContent = `It's ${player2Input.value}'s turn!`;
  } else if (currentPlayer === 2) {
    player2Score += pointsForTurn;

    const player2Cell = document.querySelector(`#round${currentRound} .p2Pts`);
    player2Cell.textContent = pointsForTurn;

    currentPlayer = 1;
    currentRound += 1;
    currentTurnElement.textContent = `It's ${player1Input.value}'s turn!`;
  }

function resetBoard() {
    boxes.fill(0);
    const boardBoxes = document.querySelectorAll(".box");
    boardBoxes.forEach((box, index) => {
      box.classList.remove("shut");
      box.textContent = index + 1;
    });
  }

  resetBoard();

  roundElement.textContent = `Round: ${currentRound}`;
  if (currentRound > 5) {
    gameOver();
    return;
  }

  rollButton.disabled = false;
  endTurnButton.disabled = true;
});

function gameOver() {
  document.querySelector(".board").style.display = "none";
  document.querySelector(".dice").style.display = "none";
  document.querySelector(".scorecard").style.display = "none";
  document.querySelector(".players").style.display = "none";

  const winnerSection = document.querySelector(".winner");
  winnerSection.style.display = "block";

  const winnerText = document.querySelector("#winner-text");
  if (player1Score < player2Score) {
    winnerText.textContent = `${player1Input.value} wins with ${player1Score} points!`;
  } else if (player2Score < player1Score) {
    winnerText.textContent = `${player2Input.value} wins with ${player2Score} points!`;
  } else {
    winnerText.textContent = `It's a tie! Both players have ${player1Score} points.`;
  }

  const playAgainButton = document.querySelector("#playAgain");
  playAgainButton.style.display = "inline-block";

  playAgainButton.addEventListener("click", () => {
    resetGame();
    playAgainButton.style.display = "none";
  });
}

function resetGame() {
  player1Score = 0;
  player2Score = 0;
  currentRound = 1;
  currentPlayer = 1;

  player1Input.value = "";
  player2Input.value = "";

  roundElement.textContent = "Round: 1";
  currentTurnElement.textContent = `It's ${player1Input.value}'s turn!`;

  const tableBody = document.querySelector("tbody");
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
  document.querySelector(".winner").style.display = "none";
  document.querySelector(".players").style.display = "block";

  boxes.fill(0);
  const boardBoxes = document.querySelectorAll(".box");
  boardBoxes.forEach((box, index) => {
    box.classList.remove("shut");
    box.textContent = index + 1;
  });
  die1.className = "bi bi-dice-1";
  die2.className = "bi bi-dice-2";
  diceSumElement.textContent = "Sum of Dice: 0";
  rollButton.disabled = true;
}


