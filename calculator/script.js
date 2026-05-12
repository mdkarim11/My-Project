const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const keysEl = document.querySelector(".keys");

let expression = "";
let justCalculated = false;

const operators = ["+", "-", "*", "/", "%"];

function displayExpression(value) {
  return value
    .replace(/\*/g, "×")
    .replace(/\//g, "÷")
    .replace(/-/g, "−");
}

function updateDisplay(result = expression || "0") {
  expressionEl.textContent = displayExpression(expression);
  resultEl.textContent = displayExpression(String(result));
}

function isOperator(value) {
  return operators.includes(value);
}

function getCurrentNumber() {
  const parts = expression.split(/[+\-*/%]/);
  return parts[parts.length - 1];
}

function appendValue(value) {
  if (justCalculated && !isOperator(value)) {
    expression = "";
  }

  justCalculated = false;

  if (value === ".") {
    const currentNumber = getCurrentNumber();
    if (currentNumber.includes(".")) return;
    if (currentNumber === "") {
      expression += "0";
    }
  }

  if (isOperator(value)) {
    if (expression === "" && value !== "-") return;

    const lastChar = expression.slice(-1);
    if (isOperator(lastChar)) {
      expression = expression.slice(0, -1);
    }
  }

  expression += value;
  updateDisplay();
}

function clearCalculator() {
  expression = "";
  justCalculated = false;
  updateDisplay();
}

function deleteLast() {
  if (justCalculated) {
    clearCalculator();
    return;
  }

  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  if (!expression) return;

  const lastChar = expression.slice(-1);
  if (isOperator(lastChar)) {
    expression = expression.slice(0, -1);
  }

  try {
    const total = Function(`"use strict"; return (${expression})`)();

    if (!Number.isFinite(total)) {
      throw new Error("Invalid calculation");
    }

    const rounded = Math.round((total + Number.EPSILON) * 100000000) / 100000000;
    expression = String(rounded);
    justCalculated = true;
    updateDisplay(rounded);
  } catch {
    expression = "";
    justCalculated = true;
    expressionEl.textContent = "";
    resultEl.textContent = "Error";
  }
}

keysEl.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const { value, action } = button.dataset;

  if (action === "clear") clearCalculator();
  if (action === "delete") deleteLast();
  if (action === "equals") calculate();
  if (value) appendValue(value);
});

window.addEventListener("keydown", (event) => {
  const { key } = event;

  if (/^[0-9.]$/.test(key) || isOperator(key)) {
    event.preventDefault();
    appendValue(key);
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
  }

  if (key === "Backspace") {
    event.preventDefault();
    deleteLast();
  }

  if (key === "Escape") {
    event.preventDefault();
    clearCalculator();
  }
});

updateDisplay();
