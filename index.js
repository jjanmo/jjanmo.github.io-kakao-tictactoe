const gametypeBox = document.getElementById('js-gametype-box');
const pvcLabel = document.getElementById('pvc-label');
const pvpLabel = document.getElementById('pvp-label');
const msgEle = document.getElementById('js-msg');
const characters = document.querySelectorAll('.character');
const choiceList = document.getElementById('js-choice-list');
const player1Ele = document.querySelector('.player1');
const player2Ele = document.querySelector('.player2');
const buttonOverlay = document.getElementById('js-button-overlay');
const startButton = document.getElementById('js-start-button');
const blocks = document.querySelectorAll('.block');
const restartButton = document.getElementById('js-restart-button');

let whoChoosing = 'player1';
let isPvC = true;
let playerCharacter = {
    player1: '',
    player2: '',
    computer: '',
};
let curTurn = 'player1'
let blockData = {
    '00': '',
    '01': '',
    '02': '',
    '10': '',
    '11': '',
    '12': '',
    '20': '',
    '21': '',
    '22': ''
}

function addControllerEvent() {
    gametypeBox.addEventListener('change', handleGameType);
    characters.forEach(ele => ele.addEventListener('click', handleChooseCharacter));
    choiceList.addEventListener('click', handleClickPlayer);
}

function removeControllerEvent() {
    gametypeBox.removeEventListener('change', handleGameType);
    characters.forEach(ele => ele.removeEventListener('click', handleChooseCharacter));
    choiceList.removeEventListener('click', handleClickPlayer);
}

function gameInit() {
    pvcLabel.classList.add('checked-pvc');
    pvpLabel.classList.remove('checked-pvp');
    document.getElementById('pvc').checked = true;
    isPvC = true;
    changeText('player', 'computer');
    choosingInit();
    msgEle.textContent = 'start after choosing or click start right now';
    msgEle.className = 'msg';
    blockData = {
        '00': '',
        '01': '',
        '02': '',
        '10': '',
        '11': '',
        '12': '',
        '20': '',
        '21': '',
        '22': ''
    }
    curTurn = 'player1';
    blocks.forEach(block => block.className = 'block');
    buttonOverlay.classList.remove('hidden');
    addControllerEvent();
    restartButton.classList.add('hidden');
}

function printMessage(type, msg) {
    msgEle.textContent = msg;
    switch (type) {
        case 'controller': {
            msgEle.className = 'msg warning';
            setTimeout(function () {
                msgEle.textContent = 'start after choosing or click start right now';
                msgEle.classList.remove('warning');
            }, 1500);
            break;
        }
        case 'start-game': {
            msgEle.className = 'msg notice';
            break;
        }
        case 'turn': {
            msgEle.className = 'msg turn';
            break;
        }
        case 'win': {
            msgEle.className = 'msg winner';
            break;
        }
        case 'draw': {
            msgEle.className = 'msg notice';
            break;
        }
    }
}

function choosingInit() {
    player1Ele.classList.add('choosing');
    player1Ele.nextElementSibling.textContent = '';
    player2Ele.classList.remove('choosing');
    player2Ele.nextElementSibling.textContent = '';
    characters.forEach(character => {
        character.firstElementChild.classList.remove('choosed');
    });
    playerCharacter = {
        player1: '',
        player2: '',
        computer: '',
    };
}

function handleGameType(e) {
    choosingInit();
    const target = e.target;
    if (target.id === 'pvc') {
        pvcLabel.classList.add('checked-pvc');
        pvpLabel.classList.remove('checked-pvp');
        changeText('player', 'computer');
        isPvC = true;
    }
    else {
        pvcLabel.classList.remove('checked-pvc');
        pvpLabel.classList.add('checked-pvp');
        changeText('player1', 'player2');
        isPvC = false;
    }
    whoChoosing = 'player1';
}

function changeText(text1, text2) {
    player1Ele.textContent = text1;
    player2Ele.textContent = text2;
}

function checkCharacter(characterName) {
    let isDuplicated = false;
    for (let prop in playerCharacter) {
        if (playerCharacter[prop] && playerCharacter[prop] === characterName) {
            isDuplicated = true;
            break;
        }
    }
    return isDuplicated;
}

function handleChooseCharacter(e) {
    const character = e.currentTarget;
    const characterName = character.className.split(' ')[1];
    if (checkCharacter(characterName)) {
        printMessage('controller', 'already choosed');
        return;
    }
    playerCharacter[whoChoosing] = characterName;
    document.querySelector(`.${whoChoosing}-character`).textContent = characterName;
    characters.forEach(character => {
        character.firstElementChild.classList.remove('choosed');
    });
    for (let prop in playerCharacter) {
        const characterName = playerCharacter[prop];
        if (characterName) {
            document.querySelector(`.${characterName}`).firstElementChild.classList.add('choosed');
        }
    }
}

function handleClickPlayer(e) {
    const target = e.target;
    if (target.textContent.includes('computer')) {
        printMessage('controller', 'computer will be selected automatically');
        return;
    }
    if (target.classList.contains('player1')) {
        player2Ele.classList.remove('choosing');
        target.classList.add('choosing');
    }
    else if (target.classList.contains('player2')) {
        player1Ele.classList.remove('choosing');
        target.classList.add('choosing');
    }
    whoChoosing = target.className.split(' ')[0];
}

function getRandomCharacterName() {
    let choosedCharacterName = '';
    do {
        const randomNumber = Math.floor(Math.random() * 8);
        choosedCharacterName = characters[randomNumber].className.split(' ')[1];
    } while (checkCharacter(choosedCharacterName));

    return choosedCharacterName;
}

function setCharacter(isPvC) {
    if (isPvC) {
        for (let prop in playerCharacter) {
            if (prop !== 'player2' && !playerCharacter[prop]) {
                const characterName = getRandomCharacterName();
                playerCharacter[prop] = characterName;
                document.querySelector(`.${characterName}`).firstElementChild.classList.add('choosed');
            }
        }
        player1Ele.nextElementSibling.textContent = playerCharacter.player1;
        player2Ele.nextElementSibling.textContent = playerCharacter.computer;
    }
    else {
        for (let prop in playerCharacter) {
            if (prop !== 'computer' && !playerCharacter[prop]) {
                const characterName = getRandomCharacterName();
                playerCharacter[prop] = characterName;
                document.querySelector(`.${characterName}`).firstElementChild.classList.add('choosed');
            }
        }
        player1Ele.nextElementSibling.textContent = playerCharacter.player1;
        player2Ele.nextElementSibling.textContent = playerCharacter.player2;
    }
}

function handleGameStart(_) {
    setCharacter(isPvC);
    buttonOverlay.classList.add('hidden');
    player1Ele.classList.remove('choosing');
    player2Ele.classList.remove('choosing');
    removeControllerEvent();
    blocks.forEach(ele => ele.addEventListener('click', handleClickBlock));
    printMessage('start-game', 'start game');
    setTimeout(function () {
        printMessage('turn', `${playerCharacter[curTurn]} turn`);
    }, 1000);
    restartButton.classList.remove('hidden');
}

function changeTurn() {
    if (isPvC) {
        curTurn = (curTurn === 'player1') ? 'computer' : 'player1';
    }
    else {
        curTurn = (curTurn === 'player1') ? 'player2' : 'player1';
    }
    printMessage('turn',
        `${curTurn === 'computer'
            ? `[computer] ${playerCharacter[curTurn]} turn`
            : `${playerCharacter[curTurn]} turn`}`
    );
}

function handleClickBlock(e) {
    const target = e.target;
    const blockId = target.id;
    const character = playerCharacter[curTurn];
    if (blockData[blockId]) return;
    blockData[blockId] = curTurn;
    target.classList.add('clicked');
    target.classList.add(`${character}-in-block`);
    showGameResult(checkGameResult());
}

function clickedByComputer() {
    let isFull = false;
    while (!isFull) {
        const id = `${Math.floor(Math.random() * 3)}${Math.floor(Math.random() * 3)}`;
        if (!blockData[id]) {
            blockData[id] = curTurn;
            document.getElementById(`${id}`).classList.add('clicked');
            document.getElementById(`${id}`).classList.add(`${playerCharacter[curTurn]}-in-block`);
            isFull = true;
        }
    }
    showGameResult(checkGameResult());
}

function checkGameResult() {
    let result = '';
    const winnableLocs = [
        ['00', '01', '02'],
        ['10', '11', '12'],
        ['20', '21', '22'],
        ['00', '10', '20'],
        ['01', '11', '21'],
        ['02', '12', '22'],
        ['00', '11', '22'],
        ['02', '11', '20']
    ];

    winnableLocs.forEach((loc, idx) => {
        const firstBlock = blockData[loc[0]];
        const secondBlock = blockData[loc[1]];
        const thirdBlock = blockData[loc[2]];
        if (
            (firstBlock && firstBlock === secondBlock)
            && (secondBlock && secondBlock === thirdBlock)
        ) {
            result = 'win';
            displayWinBlock(winnableLocs[idx]);
            printMessage('win', `${playerCharacter[curTurn]} win`);
        }
    });

    if (!result) {
        for (let id in blockData) {
            if (!blockData[id]) return 'next';
        }
        return 'draw';
    }
}

function showGameResult(result) {
    if (result === 'next') {
        changeTurn();
        if (curTurn === 'computer') setTimeout(clickedByComputer, 600);
    }
    else {
        if (result === 'draw') {
            blocks.forEach(ele => ele.classList.add('draw'));
            printMessage('draw', 'draw')
        }
        blocks.forEach(ele => ele.removeEventListener('click', handleClickBlock));
    }
}

function displayWinBlock(loc) {
    loc.forEach(id => {
        document.getElementById(`${id}`).classList.add('win');
    });
}

function handleGameRestart() {
    gameInit();
}

function init() {
    addControllerEvent();
    startButton.addEventListener('click', handleGameStart);
    restartButton.addEventListener('click', handleGameRestart);
}

init();
