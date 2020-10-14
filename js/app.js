const btnStart = document.querySelector('.btn-start');
const btnSkip = document.querySelector('.btn-skip');
const btnSubmit = document.querySelector('.btn-submit');
const question = document.querySelector('.question');
const currPrizeMsg = document.querySelector('.current-prize');
const totalPrizeMsg = document.querySelectorAll('.total-prize');
const form = document.querySelector('.form');
const finMsg = document.querySelector('.final-message')
const finMsgMil = document.querySelector('.final-message-million');
const text = document.querySelectorAll('.text');
let initRoundPrize = 100;
let arrOfUsedQuestionsArr = [];
let initCounterCount = 1;
let initGameCounter = 0;
let result = 0;
let maxPrize = 1000000;
let questionsArr = [];
let intOneHundred = 100;
let intOne = 1;
let intZero = 0;
let intTwo = 2;
let questionNum;

for (let i = 0; i < localStorage.length; i++) {
    let item = localStorage.getItem(`${i}`)
    questionsArr.push(JSON.parse(item));
}


btnSkip.addEventListener('click', generateQuestion, {once: true});

function startGame() {
    initRoundPrize = intOneHundred;
    arrOfUsedQuestionsArr= [];
    initCounterCount = intOne;
    initGameCounter = intZero;
    result = intZero;
    form.style.visibility = 'visible';
    btnSubmit.style.visibility = 'visible';

    finMsg.style.display = 'none';
    finMsgMil.style.display = 'none';
    generateQuestion();
}

function generateQuestion(event, prize = initRoundPrize, total = result) {
    questionNum = getRandomQuestion();
    question.innerText = questionsArr[questionNum].question + ':';
    let optionAnswer = questionsArr[questionNum].content;

    console.log(questionsArr[questionNum]);

    for (let i = 0; i < optionAnswer.length; i++) {
        question.insertAdjacentHTML('beforeend',
            `<li> <label for="${i}">
            <input id="${i}" type="radio" name="${questionNum}" value="${i}">
            ${optionAnswer[i]}
        </label></li>`)
    }


    currPrizeMsg.style.visibility = 'visible';
    totalPrizeMsg[0].style.visibility = 'visible';
    btnSkip.style.visibility = 'visible';

    text.forEach(function(el) {
        el.style.visibility = 'visible';
    })

    currPrizeMsg.innerText = initRoundPrize || prize;
    totalPrizeMsg[0].innerText = total || result;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let formData = new FormData(form);

        for (const value of formData) {
            checkAnswer(+value[intOne], questionsArr[questionNum].correct);
        }
    });
}

function checkAnswer(userAnswer, correctAnswer) {
    if (+userAnswer === correctAnswer) {
        result = result + initRoundPrize;
        if (result < maxPrize) {
            initCounterCount++;
            initGameCounter++;
            initRoundPrize = intOneHundred * Math.pow(intTwo, initGameCounter);
            generateQuestion(initRoundPrize, result);

        } else {
            totalPrizeMsg[1].innerText = maxPrize;
            currPrizeMsg.style.visibility = 'hidden';
            totalPrizeMsg[intTwo].style.visibility = 'hidden';
            text[0].style.visibility = 'hidden';
            totalPrizeMsg[0].style.visibility = 'hidden';
            text[1].style.visibility = 'hidden';
            finMsgMil.style.display = 'block';
        }
    } else if (+userAnswer !== correctAnswer) {
        form.style.visibility = 'hidden';
        btnSubmit.style.visibility = 'hidden';
        text[0].style.visibility = 'hidden';
        totalPrizeMsg[0].style.visibility = 'hidden';
        text[1].style.visibility = 'hidden';
        currPrizeMsg.style.visibility = 'hidden';
        finMsg.style.display = 'block';
        totalPrizeMsg[intTwo].innerText = result;
    }
}


function getRandomQuestion() {
    let questionNum = Math.floor(Math.random() * (questionsArr.length - 1) + 1);
    arrOfUsedQuestionsArr.forEach(el => {
        if (el !== questionNum) {
            arrOfUsedQuestionsArr.push(questionNum);
        } else {
            getRandomQuestion();
        }
    })
    return questionNum;
}


btnStart.addEventListener('click', startGame);
