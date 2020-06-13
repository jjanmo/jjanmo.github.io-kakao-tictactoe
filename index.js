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


//어떤 유저가 선택중인지
let whoChoosing = 'player1';

//게임타입
let isPvC = true;

//유저가 선택한 캐릭터 정보
let playerCharacter = {
    player1: '',
    player2: '',
    computer: '',
};

//턴교환
let curTurn = 'player1'

//블럭데이터의 상태
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

//controller : add event listener
function addControllerEvent() {
    gametypeBox.addEventListener('change', handleGameType);
    characters.forEach(ele => ele.addEventListener('click', handleChooseCharacter));
    choiceList.addEventListener('click', handleClickPlayer);
}

//controller : remove event listener
function removeControllerEvent() {
    gametypeBox.removeEventListener('change', handleGameType);
    characters.forEach(ele => ele.removeEventListener('click', handleChooseCharacter));
    choiceList.removeEventListener('click', handleClickPlayer);
}

function gameInit() {
    //게임방식 초기화
    pvcLabel.classList.add('checked-pvc');
    pvpLabel.classList.remove('checked-pvp');
    document.getElementById('pvc').checked = true; //input radio 
    isPvC = true;
    changeText('player', 'computer');

    //캐릭터 선택 초기화
    choosingInit();

    //메세지 초기화
    msgEle.textContent = 'start after choosing or click start right now';
    msgEle.className = 'msg';

    //블럭데이터 초기화
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
    //턴 초기화
    curTurn = 'player1';

    //보드 초기화
    blocks.forEach(block => block.className = 'block');
    buttonOverlay.classList.remove('hidden');

    //add controller event listener
    addControllerEvent()

    //remove restart button
    restartButton.classList.add('hidden');
}


/* print message */

function printMessage(type, msg) {
    //추후 타입에 따라서 변경 가능
    msgEle.textContent = msg;
    switch (type) {
        case 'controller':
            msgEle.className = 'msg warning';
            setTimeout(function () {
                msgEle.textContent = 'start after choosing or click start right now';
                msgEle.classList.remove('warning');
            }, 1500);
            break;
        case 'start-game':
            msgEle.className = 'msg notice';
            break;
        case 'turn':
            msgEle.className = 'msg turn';
            break;
        case 'win':
            msgEle.className = 'msg winner';
            break;
        case 'draw':
            msgEle.className = 'msg notice';
            break;
    }
}

/* handel game type */

//캐릭터 선택 초기화
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
    //눌리면 게임방식이 바뀌는 것이기 때문에 선택관련 사항은 전부 초기화가 되어야함
    choosingInit();
    // console.log(e.target);
    const target = e.target;
    if (target.id === 'pvc') { //choose pvc
        pvcLabel.classList.add('checked-pvc');
        pvpLabel.classList.remove('checked-pvp');
        changeText('player', 'computer');
        isPvC = true;
    }
    else {//choose pvp
        pvcLabel.classList.remove('checked-pvc');
        pvpLabel.classList.add('checked-pvp');
        changeText('player1', 'player2');
        isPvC = false;
    }
    whoChoosing = 'player1';
}

//게임방식에 따른 choiceList 텍스트변경
function changeText(text1, text2) {
    player1Ele.textContent = text1;
    player2Ele.textContent = text2;
}


/* handle choosing character */

//캐릭터 중복 선택 체크
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
    //check
    if (checkCharacter(characterName)) {
        printMessage('controller', 'already choosed');
        return;
    }
    //set data
    playerCharacter[whoChoosing] = characterName;
    //render
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
    //컴퓨터는 알아서 선택됨
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


/*game start*/

function getRandomCharacterName() {
    let choosedCharacterName = '';
    do {
        const randomNumber = Math.floor(Math.random() * 8);
        choosedCharacterName = characters[randomNumber].className.split(' ')[1];
    } while (checkCharacter(choosedCharacterName));

    return choosedCharacterName;
}

//캐릭터 설정없이 바로 시작할 수 있게 하기 위한 함수
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

function handleGameStart(e) {
    // if do not choose character, select random character
    setCharacter(isPvC)
    //remove overlay
    buttonOverlay.classList.add('hidden');
    //remove class 'choosing'  
    player1Ele.classList.remove('choosing');
    player2Ele.classList.remove('choosing');
    //remove controller eventlistener
    removeControllerEvent();
    //add block eventlistener 
    blocks.forEach(ele => ele.addEventListener('click', handleClickBlock));
    //print message
    printMessage('start-game', 'start game');
    setTimeout(function () {
        printMessage('turn', `${playerCharacter[curTurn]} turn`);
    }, 1000);
    //show restart button
    restartButton.classList.remove('hidden');
}


function changeTurn() {
    if (isPvC) {
        curTurn = curTurn === 'player1' ? 'computer' : 'player1';
    }
    else {
        curTurn = curTurn === 'player1' ? 'player2' : 'player1';
    }
    //show turn message
    printMessage('turn',
        `${curTurn === 'computer' ?
            `[computer] ${playerCharacter[curTurn]} turn` : `${playerCharacter[curTurn]} turn`}`);
}

/* click event in block */

function handleClickBlock(e) {
    const target = e.target;
    const blockId = target.id;
    const character = playerCharacter[curTurn];
    //when clicking same block 
    if (blockData[blockId]) return;

    //set blockdata
    blockData[blockId] = curTurn;

    //render 
    target.classList.add('clicked');
    target.classList.add(`${character}-in-block`);
    showGameResult(checkGameResult());
}

//컴퓨터 자동 클릭
function clickedByComputer() {
    let isFull = false; //컴퓨터가 빈칸을 채웠는지 여부
    while (!isFull) {
        const id = `${Math.floor(Math.random() * 3)}${Math.floor(Math.random() * 3)}`;
        if (!blockData[id]) {
            //set data
            blockData[id] = curTurn;
            //render
            document.getElementById(`${id}`).classList.add('clicked');
            document.getElementById(`${id}`).classList.add(`${playerCharacter[curTurn]}-in-block`);
            isFull = true;
        }
    }
    showGameResult(checkGameResult());
}


//check game-end : who win or draw
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
    //check win
    winnableLocs.forEach((loc, idx) => {
        if (blockData[loc[0]] && blockData[loc[0]] === blockData[loc[1]] &&
            blockData[loc[1]] && blockData[loc[1]] === blockData[loc[2]]) {
            result = 'win';
            //show win
            displayWinBlock(winnableLocs[idx]);
            printMessage('win', `${playerCharacter[curTurn]} win`);
        }
    });

    //check draw
    if (!result) {
        for (let id in blockData) {
            if (!blockData[id]) return 'next';
        }
        return 'draw';
    }
}

function showGameResult(result) {
    if (result === 'next') {
        //change turn
        changeTurn();
        if (curTurn === 'computer') setTimeout(clickedByComputer, 600);
    }
    else { //win or draw
        if (result === 'draw') {
            blocks.forEach(ele => ele.classList.add('draw'));
            printMessage('draw', 'draw')
        }
        //remove block click event after game-end (win or draw)
        blocks.forEach(ele => ele.removeEventListener('click', handleClickBlock));
    }
}

function displayWinBlock(loc) {
    loc.forEach(id => {
        document.getElementById(`${id}`).classList.add('win');
    });
}

/* restart */
function handleGameRestart() {
    gameInit();
}

function init() {
    addControllerEvent();
    startButton.addEventListener('click', handleGameStart);
    restartButton.addEventListener('click', handleGameRestart);
}

init();
