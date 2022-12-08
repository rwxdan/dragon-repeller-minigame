"use strict";
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let inventory = ["stick"];
let fighting, monsterHealth;

const button_1 = document.querySelector("#button1");
const button_2 = document.querySelector("#button2");
const button_3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
  {
    name: "stick",
    power: 5,
  },
  {
    name: "dagger",
    power: 30,
  },
  {
    name: "claw hammer",
    power: 50,
  },
  {
    name: "sword",
    power: 100,
  },
];

const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15,
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60,
  },
  {
    name: "dragon",
    level: 20,
    health: 300,
  },
];

const locations = [
  {
    name: "Town Square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'You\'re in the town square. You see a sign that says "Store".',
  },
  {
    name: "Store",
    "button text": [
      "Buy 10 health (10 gold)",
      "Buy weapon (30 gold)",
      "Go to town square",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store!",
  },
  {
    name: "Cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to Town Square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters!",
  },
  {
    name: "Fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You're fighting a monster.",
  },
  {
    name: "Kill monster",
    "button text": [
      "Go to town square",
      "Go to town square",
      "Go to town square",
    ],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster screams "AAARGHH!" as it dies. You gain experience points and find gold.',
  },
  {
    name: "GAME OVER",
    "button text": ["Replay?", "Replay?", "Replay?"],
    "button functions": [restart, restart, restart],
    text: "You die. 💀",
  },
  {
    name: "Win game",
    "button text": ["Replay?", "Replay?", "Replay?"],
    "button functions": [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN THE GAME! 🎉",
  },
  {
    name: "Easter egg",
    "button text": ["2", "8", "Go to Town Square"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chooser between 0 and 10. If the number you choose matches one of the random numbers, you win!",
  },
];

button_1.onclick = goStore;
button_2.onclick = goCave;
button_3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button_1.textContent = location["button text"][0];
  button_2.textContent = location["button text"][1];
  button_3.textContent = location["button text"][2];
  button_1.onclick = location["button functions"][0];
  button_2.onclick = location["button functions"][1];
  button_3.onclick = location["button functions"][2];
  text.textContent = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}
function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.textContent = gold;
    healthText.textContent = health;
  } else {
    text.textContent;
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.textContent = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.textContent = `You now have ${newWeapon}.`;
      inventory.push(newWeapon);
      text.textContent += ` In your inventory you have: ${inventory}`;
    } else {
      text.textContent = "You don't have enough gold to buy a weapon.";
    }
  } else {
    text.textContent = "You already have the most powerful weapon!";
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.textContent = gold;
    let currentWeapon = inventory.shift();
    text.textContent = `You sold a ${currentWeapon}.`;
    text.textContent += ` In your inventory you have: ${inventory}`;
  } else {
    text.textContent = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}
function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterNameText.textContent = monsters[fighting].name;
  monsterHealthText.textContent = monsterHealth;
}

function attack() {
  text.textContent = `The ${monsters[fighting].name} attacks.`;
  text.textContent += `You attack with your ${weapons[currentWeapon].name}.`;

  if (isMonsterHit()) {
    health -= getMonsterAttackVal(monsters[fighting].level);
  } else {
    text.textContent = "You miss.";
  }

  monsterHealth -=
    weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  healthText.textContent = health;
  monsterHealthText.textContent = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster();
  }

  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.textContent += `Your ${inventory.pop()} breaks.`;
    currentWeapon--;
  }
}

function getMonsterAttackVal(level) {
  let hit = level * 5 - Math.floor(Math.random() * xp);
  return hit;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  text.textContent = `You dodge the attack from ${monsters[fighting].name}.`;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.textContent = gold;
  xpText.textContent = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.textContent = gold;
  healthText.textContent = health;
  xpText.textContent = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  let numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }

  text.textContent = `You picked ${guess}. Here are the random numbers:\n`;
  for (let i = 0; i < 10; i++) {
    text.textContent += `${numbers[i]} \n`;
  }

  if (numbers.indexOf(guess) !== -1) {
    text.textContent += "Right! You win 20 gold!";
    gold += 20;
    goldText.textContent = gold;
  } else {
    text.textContent += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.textContent = health;
  }
  if (health <= 0) {
    lose();
  }
}
