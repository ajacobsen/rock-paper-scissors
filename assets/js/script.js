
const GameStates = {
    INIT_GAME: -2,
    PRE_GAME: -1,
    PRE_ROUND: 0,
    MID_ROUND: 1,
    END_ROUND: 2,
    RESET_ROUND: 3,
    END_GAME: 4
}

class Hand {
    constructor(name, index) {
        this.index = index;
        this.name = name;
        this.node = document.createElement('div');
        this.node.classList.add('handsign');
        this.node.classList.add(`${name}`);
        this.node.setAttribute('data-name', name);
        this.node.setAttribute('data-index', index);
    }

    setSelected() {
        this.node.classList.add('selected');
        let siblings = getSiblings(this.node);
        siblings.forEach(el => {
            el.onclick = '';
            el.classList.add('fade');
        });
        switch (this.index) {
            case 0:
                this.node.style.setProperty('transform', 'translateY(200px)');
                break;
            case 2:
                this.node.style.setProperty('transform', 'translateY(-200px)');
                break;
            default:
                break;
        }
    }
}

class CPUHand {
    constructor(name, index) {
        this.index = index;
        this.name = name;
        this.node = document.createElement('div');
        this.node.classList.add('cpu-handsign');
        this.node.classList.add(`${name}`);
        this.node.setAttribute('data-name', name);
        this.node.setAttribute('data-index', index);
    }
}

const player = {
    selectedHand: null,
    score: 0,

    setHand: function (hand) {
        player.selectedHand = hand;
        hand.setSelected();
    },
    resetHand: function () {
        player.selectedHand.node.classList.remove('selected');
        player.selectedHand.node.style.removeProperty('transform');
        getSiblings(player.selectedHand.node).forEach(hand => {
            hand.classList.remove('fade');
        });
    }
};

const cpu = {
    hand: null,
    score: 0,

    setHand: function () {
        let i = Math.floor(Math.random() * 3);
        switch (i) {
            case 0:
                cpu.hand = new CPUHand('paper', 0);
                break;
            case 1:
                cpu.hand = new CPUHand('rock', 1);
                break;
            case 2:
                cpu.hand = new CPUHand('scissors', 2);
            default:
                break;
        }
        cpu.hand.node.classList.add('loading');
        document.querySelector('.cpu').replaceChildren(cpu.hand.node);
    },

    resetHand: function () {
        cpu.hand = new CPUHand('random', 3);
        document.querySelector('.cpu').replaceChildren();
        document.querySelector('.cpu').appendChild(cpu.hand.node);
    }
};

const game = {
    player: player,
    cpu : cpu,
    state: GameStates.INIT_GAME,
    hands: [],
    btnNextRound: document.getElementById('btn-next-round'),

    setResult: function () {
        let result = player.selectedHand.index - cpu.hand.index;
        if (result === -2 || result === 1) {
            cpu.score++;
        } else if (result === -1 || result === 2) {
            player.score++;
        }
        switch(player.score) {
            case 3:
                document.getElementById('player-star-3').classList.add('star-active');
            case 2:
                document.getElementById('player-star-2').classList.add('star-active');
            case 1:
                document.getElementById('player-star-1').classList.add('star-active');
                break;
        }
        switch(cpu.score) {
            case 3:
                document.getElementById('cpu-star-3').classList.add('star-active');
            case 2:
                document.getElementById('cpu-star-2').classList.add('star-active');
            case 1:
                document.getElementById('cpu-star-1').classList.add('star-active');
                break;
        }
    },

    resetScore: function () {
        player.score = 0;
        cpu.score = 0;
        document.getElementById('player-star-3').classList.remove('star-active');
        document.getElementById('player-star-2').classList.remove('star-active');
        document.getElementById('player-star-1').classList.remove('star-active');
        document.getElementById('cpu-star-3').classList.remove('star-active');
        document.getElementById('cpu-star-2').classList.remove('star-active');
        document.getElementById('cpu-star-1').classList.remove('star-active');
    },

    onHandSelected: function(event) {
        player.setHand(game.hands[event.target.dataset.index]);
        player.selectedHand.node.onclick = '';
        game.state = GameStates.PRE_ROUND;
        game.run();
    },

    resetHands: function () {
        game.state = GameStates.RESET_ROUND;
        game.run();
    },

    resetGame: function () {
        game.state = GameStates.INIT_GAME;
        game.run();
    },
    
    run: function () {
        switch (game.state) {
            case GameStates.INIT_GAME:
                game.resetScore();
                game.btnNextRound.innerText = 'Next Round';
                game.btnNextRound.onclick = game.resetHands;
                game.btnNextRound.setAttribute('disabled', true);
            case GameStates.PRE_GAME:
                cpu.resetHand();
                game.hands = [new Hand('paper', 0), new Hand('rock', 1), new Hand('scissors', 2)];
                document.querySelector('.player').replaceChildren();
                game.hands.forEach(hand => {
                    document.querySelector('.player').appendChild(hand.node);
                    hand.node.onclick = game.onHandSelected.bind(game);
                });
                break;
            case GameStates.PRE_ROUND:
                cpu.hand.node.classList.add('loading');
                game.state = GameStates.MID_ROUND;
                setTimeout(game.run.bind(game), 500);
                break;
            case GameStates.MID_ROUND:
                cpu.setHand();
                game.state = GameStates.END_ROUND;
                setTimeout(game.run.bind(game), 300);
                break;
            case GameStates.RESET_ROUND:
                game.btnNextRound.setAttribute('disabled', true);
                player.resetHand();
                game.state = GameStates.PRE_GAME;
                setTimeout(game.run.bind(game), 650);
                break;
            case GameStates.END_ROUND:
                game.setResult();
                if (player.score === 3 || cpu.score === 3) {
                    game.btnNextRound.innerText = 'New Game';
                    game.btnNextRound.onclick = game.resetGame;
                }
                game.btnNextRound.removeAttribute('disabled');
                break;
            default:
                break;
        }
    }
}

function getSiblings(el) {
    let siblings = [];
    if(!el.parentNode) return siblings;

    let sibling = el.parentNode.firstChild;
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== el) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }
    return siblings;
}

game.run();

