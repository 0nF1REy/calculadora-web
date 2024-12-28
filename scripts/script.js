const display = document.querySelector("#display");
const buttons = document.querySelector(".buttons");

const actions = {
    append: appendValue,
    clear: clearDisplay,
    delete: deleteLast,
    operator: appendOperator,
    function: applyFunction,
    calculate: calculate,
};

function activateButton(button) {
    button.classList.add("active");
    setTimeout(() => button.classList.remove("active"), 100);
}

buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const action = button.dataset.action;
    const value = button.dataset.value;

    if (actions[action]) {
        actions[action](value);
        activateButton(button);
    }
});

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (key.startsWith("F") && parseInt(key.slice(1)) >= 1 && parseInt(key.slice(1)) <= 12) {
        return;
    }

    if (/[0-9\.]/.test(key)) {
        appendValue(key);
    } else if (["+", "-", "*", "/", "x", "÷", ","].includes(key)) {
        let operator = key.replace("*", "x").replace("/", "÷");
        if (operator === '+') {
            operator = '+';
        }
        appendOperator(operator);
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Enter") {
        calculate();
    } else if (key === "Escape") {
        clearDisplay();
    }
});


function appendValue(value) {
    const lastChar = display.value.slice(-1);
    if ((value === '.' || value === ',') && (lastChar === '.' || lastChar === ',')) return;
    if ("+-*/÷".includes(value) && "+-*/÷".includes(lastChar)) {
        display.value = display.value.slice(0, -1) + value;
        return;
    }
    display.value += value;
    removeInvalidClass();
}

function clearDisplay() {
    display.value = "";
    removeInvalidClass();
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
    removeInvalidClass();
}

function appendOperator(operator) {
    const lastChar = display.value.slice(-1);
    if ("+-*/÷".includes(lastChar)) {
        display.value = display.value.slice(0, -1) + operator;
    } else {
        display.value += operator;
    }
    removeInvalidClass();
}

function applyFunction(funcName) {
    try {
        const inputValue = parseFloat(display.value.replace(",", "."));
        let result;
        switch (funcName) {
            case "sin":
                result = Math.sin(inputValue);
                break;
            case "cos":
                result = Math.cos(inputValue);
                break;
            case "tan":
                result = Math.tan(inputValue);
                break;
            case "sqrt":
                result = Math.sqrt(inputValue);
                break;
            default:
                return;
        }
        display.value = result.toString().replace(".", ",");
        removeInvalidClass();
    } catch (error) {
        display.value = "INVÁLIDO";
        addInvalidClass();
    }
}

function calculate() {
    try {
        const expression = display.value;
        if (!expression) return;
        let result;
        const parts = expression.split(/([+\-x÷])/).filter(Boolean);
        console.log(parts);

        let currentNumber = parseFloat(parts[0].replace(",", "."));
        console.log(currentNumber);

        for (let i = 1; i < parts.length; i += 2) {
            const operator = parts[i];
            const nextNumber = parseFloat(parts[i + 1].replace(",", "."));

            switch (operator) {
                case "+":
                    currentNumber += nextNumber;
                    break;
                case "-":
                    currentNumber -= nextNumber;
                    break;
                case "x":
                    currentNumber *= nextNumber;
                    break;
                case "÷":
                    if (nextNumber === 0) {
                        display.value = "ERRO";
                        addInvalidClass();
                        return;
                    }
                    currentNumber /= nextNumber;
                    break;
                default:
                    display.value = "ERRO";
                    addInvalidClass();
                    return;
            }
        }
        display.value = currentNumber.toString().replace(".", ",");
        removeInvalidClass();
    } catch (error) {
        display.value = "INVÁLIDO";
        addInvalidClass();
    }
}

function addInvalidClass() {
    display.classList.add("invalid");
}

function removeInvalidClass() {
    display.classList.remove("invalid");
}