const handsigns = ["paper", "rock", "scissors"];

function computerPlay() {
    return handsigns[Math.floor(Math.random() * handsigns.length)];
}

function playRound(playerSelection, computerSelection) {
    let player = handsigns.indexOf(playerSelection.toLowerCase());
    let cpu = handsigns.indexOf(computerSelection.toLowerCase());
    return player - cpu
}

function game() {
    let score = 0;
    for (let i = 1; i < 6; i++) {
        let plr = prompt();
        let cpu = computerPlay();
        let result = playRound(plr, cpu);
        console.log("Round: " + i);
        console.log("player throws: " + plr);
        console.log("computer throws: " + cpu);
        if (result === 0) {
            console.log("It's a tie!");
        } else if (result === -2) {
            console.log(cpu + " beats " + plr);
            score--;
        } else if (result === -1) {
            console.log(plr + " beats " + cpu);    
            score++;
        } else if (result === 1) {
            console.log(cpu + " beats " + plr);
            score--;
        } else if (result === 2) {
            console.log(plr + " beats " + cpu);
            score++
        } else {
            console.log("This should never happen!");
        }
    }
    console.log("Final Results:");
    if (score === 0) {
        console.log("The game is a tie!");
    } else if (score < 0) {
        console.log("The computer wins!");
    } else {
        console.log("The player wins!");
    }
}
