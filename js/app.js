let wordOfTheDay = "";
let guess = "";

const maxGuessLenght = 5;
const maxNumberOfGuesses = 5;

let isLetterVal = false;

let numberOfGuesses = 0;

let gameDone = false;

const wordsApiUrl = "https://words.dev-apis.com";

let currentRow = document.querySelectorAll(".row")[numberOfGuesses];

const keyboard = document.querySelector(".keyboard");

init();

async function init() {
    wordOfTheDay = await getWordOfTheDay();

    keyboard.addEventListener("click", function (event) {
        handelInput(event.target.innerText);
    });

    document.addEventListener("keydown", function (event) {
        handelInput(event.key);
    });
}

function handelInput(input) {
    if (gameDone) {
        return;
    }

    input = input.toLowerCase();
    console.log(input.toLowerCase());
    isLetterVal = isLetter(input);

    switch (input) {
        case "backspace":
            handleBack();
            break;
        case "⌫":
            handleBack();
            break;
        case "enter":
            handleSubmit();
            break;
        default:
            if (isLetterVal & !gameDone) {
                handelLetter(input);
            }
            break;
    }

    rerender();
}

function handelLetter(input) {
    if (guess.length >= maxGuessLenght) {
        shakeRow();
        return;
    }

    inputEffect();

    guess = guess + input;
}

function handleBack() {
    guess = guess.slice(0, -1);
}

async function handleSubmit() {
    if (guess.length < maxGuessLenght) {
        shakeRow();
        return;
    }

    const validWord = await isValidWord(guess);

    if (!validWord) {
        shakeRow();
        alert("not a valid word");

        return;
    }

    const correct = checkAnswer(guess);

    if (correct) {
        jumpingInput();
        gameDone = true;
    }

    let row = document.querySelectorAll(".row")[numberOfGuesses];
    let inputs = row.querySelectorAll(".letter-input");

    for (let i = 0; i < inputs.length; i++) {
        let currentInput = inputs[i];

        let animationDelay = i * 0.5;

        currentInput.style.setProperty("--flip-delay", animationDelay + "s");

        currentInput.classList.add("card-flip");

        let currentLetter = guess[i];

        currentInput.addEventListener(
            "animationend",
            () => {
                currentInput.classList.remove("card-flip");

                if (wordOfTheDay[i] === currentLetter) {
                    currentInput.classList.add("correct");
                } else if (wordOfTheDay.includes(currentLetter)) {
                    currentInput.classList.add("includes");
                } else {
                    currentInput.classList.add("notIncludes");
                }
            },
            { once: true },
        );
    }

    if (numberOfGuesses == maxNumberOfGuesses) {
        gameDone = true;
    }

    if (numberOfGuesses < maxNumberOfGuesses) {
        numberOfGuesses++;
        guess = "";
    }
}

function rerender() {
    let row = document.querySelectorAll(".row")[numberOfGuesses];
    let inputs = row.querySelectorAll(".letter-input");

    for (let i = 0; i < inputs.length; i++) {
        let letter = inputs[i].querySelector(".letter");
        if (guess[i] === undefined) {
            letter.innerText = "";
        } else {
            letter.innerText = guess[i];
        }
    }
}

function shakeRow() {
    let row = document.querySelectorAll(".row")[numberOfGuesses];

    row.classList.add("shake");

    row.addEventListener(
        "animationend",
        () => {
            row.classList.remove("shake");
        },
        { once: true },
    );
}

function inputEffect() {
    let row = document.querySelectorAll(".row")[numberOfGuesses];
    let inputs = row.querySelectorAll(".letter-input");

    let currentInput = inputs[guess.length];
    currentInput.classList.add("input-effect");

    currentInput.addEventListener(
        "animationend",
        () => {
            currentInput.classList.remove("input-effect");
        },
        { once: true },
    );
}

function jumpingInput() {
    let row = document.querySelectorAll(".row")[numberOfGuesses];
    let inputs = row.querySelectorAll(".letter-input");

    for (let i = 0; i < inputs.length; i++) {
        let currentInput = inputs[i];

        currentInput.classList.add("jumping");

        currentInput.addEventListener(
            "animationend",
            () => {
                currentInput.classList.remove("jumping");
            },
            { once: true },
        );
    }
}

async function getWordOfTheDay() {
    const promise = await fetch(wordsApiUrl + "/word-of-the-day");
    const processedResponse = await promise.json();

    console.log(processedResponse.word);

    return processedResponse.word;
}

async function isValidWord(word) {
    const promise = await fetch(wordsApiUrl + "/validate-word", {
        method: "POST",
        body: JSON.stringify({ word: guess }),
    });

    const processedResponse = await promise.json();

    return processedResponse.validWord;
}

function checkAnswer(guess) {
    return guess == wordOfTheDay;
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}
