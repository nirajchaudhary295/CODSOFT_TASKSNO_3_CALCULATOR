/* ========================================
   CALCULATOR VARIABLES
======================================== */

const previousDisplay = document.getElementById("previous-display");
const currentDisplay = document.getElementById("current-display");

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const actionButtons = document.querySelectorAll("[data-action]");


let currentValue = "";
let previousValue = "";

let selectedOperation = null;
let shouldResetDisplay = false;


/* ========================================
   UPDATE DISPLAY
======================================== */

function updateDisplay() {

    currentDisplay.textContent =
        currentValue === "" ? "0" : currentValue;

    previousDisplay.textContent =
        previousValue && selectedOperation
            ? `${previousValue} ${selectedOperation}`
            : "";
}


/* ========================================
   ADD NUMBER
======================================== */

function appendNumber(number) {

    if (shouldResetDisplay) {
        currentValue = "";
        shouldResetDisplay = false;
    }

    if (number === "." && currentValue.includes(".")) {
        return;
    }

    if (currentValue === "0" && number !== ".") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}


/* ========================================
   SELECT OPERATION
======================================== */

function chooseOperation(operation) {

    if (currentValue === "" && previousValue === "") {
        return;
    }

    if (previousValue !== "" && currentValue !== "") {
        calculateResult();
    }

    previousValue = currentValue;
    selectedOperation = operation;

    shouldResetDisplay = true;

    updateDisplay();
}


/* ========================================
   CALCULATE RESULT
======================================== */

function calculateResult() {

    if (
        previousValue === "" ||
        currentValue === "" ||
        selectedOperation === null
    ) {
        return;
    }

    const firstNumber = Number(previousValue);
    const secondNumber = Number(currentValue);

    let result;


    switch (selectedOperation) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "×":
            result = firstNumber * secondNumber;
            break;

        case "÷":

            if (secondNumber === 0) {
                currentValue = "Error";
                previousValue = "";
                selectedOperation = null;

                updateDisplay();

                return;
            }

            result = firstNumber / secondNumber;
            break;

        case "%":
            result = firstNumber % secondNumber;
            break;

        default:
            return;
    }


    result = roundResult(result);

    currentValue = String(result);

    previousValue = "";

    selectedOperation = null;

    shouldResetDisplay = true;

    updateDisplay();
}


/* ========================================
   ROUND DECIMAL RESULT
======================================== */

function roundResult(number) {

    return Math.round((number + Number.EPSILON) * 100000000) / 100000000;
}


/* ========================================
   CLEAR CALCULATOR
======================================== */

function clearCalculator() {

    currentValue = "";

    previousValue = "";

    selectedOperation = null;

    shouldResetDisplay = false;

    updateDisplay();
}


/* ========================================
   DELETE LAST CHARACTER
======================================== */

function deleteLastCharacter() {

    if (shouldResetDisplay) {
        return;
    }

    currentValue = currentValue.slice(0, -1);

    updateDisplay();
}


/* ========================================
   NUMBER BUTTON EVENTS
======================================== */

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        appendNumber(button.dataset.number);

    });

});


/* ========================================
   OPERATION BUTTON EVENTS
======================================== */

operationButtons.forEach(button => {

    button.addEventListener("click", () => {

        chooseOperation(button.dataset.operation);

    });

});


/* ========================================
   ACTION BUTTON EVENTS
======================================== */

actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "delete") {
            deleteLastCharacter();
        }

        if (action === "calculate") {
            calculateResult();
        }

    });

});


/* ========================================
   KEYBOARD SUPPORT
======================================== */

document.addEventListener("keydown", event => {

    const key = event.key;


    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {
        appendNumber(key);
    }


    if (
        key === "+" ||
        key === "-" ||
        key === "*"
    ) {

        const operation =
            key === "*" ? "×" : key;

        chooseOperation(operation);
    }


    if (key === "/") {

        event.preventDefault();

        chooseOperation("÷");
    }


    if (key === "%") {

        chooseOperation("%");
    }


    if (key === "Enter" || key === "=") {

        event.preventDefault();

        calculateResult();
    }


    if (key === "Backspace") {

        deleteLastCharacter();
    }


    if (key === "Escape") {

        clearCalculator();
    }

});