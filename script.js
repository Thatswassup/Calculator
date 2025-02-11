const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => b === 0 ? null : a / b;

// Calculator state
let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// DOM elements
const display = document.querySelector('.display');
const errorMessage = document.querySelector('.error-message');

// Operate function
function operate(op, a, b) {
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);

    switch(op) {
        case '+': return add(num1, num2);
        case '-': return subtract(num1, num2);
        case '×': return multiply(num1, num2);
        case '÷': return divide(num1, num2);
        default: return null;
    }
}

// Update display
function updateDisplay() {
    display.textContent = displayValue;
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 2000);
}

// Handle digit input
function inputDigit(digit) {
    if (waitingForSecondOperand) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    updateDisplay();
}

// Handle decimal point
function inputDecimal() {
    if (waitingForSecondOperand) {
        displayValue = '0.';
        waitingForSecondOperand = false;
        updateDisplay();
        return;
    }

    if (!displayValue.includes('.')) {
        displayValue += '.';
        updateDisplay();
    }
}

// Handle operators
function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator && !waitingForSecondOperand) {
        const result = operate(operator, firstOperand, inputValue);
        if (result === null) {
            showError("Cannot divide by zero!");
            return;
        }
        displayValue = `${Math.round(result * 1000000) / 1000000}`;
        firstOperand = result;
        updateDisplay();
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

// Clear calculator
function clearCalculator() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

// Event listeners
document.querySelector('.buttons').addEventListener('click', (event) => {
    if (!event.target.matches('button')) return;

    if (event.target.classList.contains('operator')) {
        if (event.target.textContent === '±') {
            displayValue = (parseFloat(displayValue) * -1).toString();
            updateDisplay();
        } else if (event.target.textContent === '%') {
            displayValue = (parseFloat(displayValue) / 100).toString();
            updateDisplay();
        } else {
            handleOperator(event.target.textContent);
        }
        return;
    }

    if (event.target.classList.contains('digit')) {
        if (event.target.textContent === '.') {
            inputDecimal();
        } else {
            inputDigit(event.target.textContent);
        }
        return;
    }

    if (event.target.classList.contains('equals')) {
        if (operator && !waitingForSecondOperand) {
            const result = operate(operator, firstOperand, displayValue);
            if (result === null) {
                showError("Cannot divide by zero!");
                return;
            }
            displayValue = `${Math.round(result * 1000000) / 1000000}`;
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = true;
            updateDisplay();
        }
        return;
    }

    if (event.target.classList.contains('clear')) {
        clearCalculator();
    }
});



