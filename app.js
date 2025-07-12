// Calculator App
class Calculator {
    constructor() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.initializeKeyboardSupport();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetDisplay = false;
    }

    delete() {
        if (this.shouldResetDisplay) {
            this.shouldResetDisplay = false;
            return;
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentOperand = '';
            this.shouldResetDisplay = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation;
        this.operation = null;
        this.previousOperand = '';
        this.shouldResetDisplay = true;
    }

    formatNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        const currentElement = document.getElementById('current');
        const historyElement = document.getElementById('history');
        
        if (this.currentOperand === '') {
            currentElement.textContent = '0';
        } else {
            currentElement.textContent = this.formatNumber(this.currentOperand);
        }
        
        if (this.operation != null) {
            const operationSymbol = this.operation === '*' ? '×' : this.operation;
            historyElement.textContent = `${this.formatNumber(this.previousOperand)} ${operationSymbol}`;
        } else {
            historyElement.textContent = '';
        }
    }

    initializeKeyboardSupport() {
        document.addEventListener('keydown', (event) => {
            if (event.key >= '0' && event.key <= '9') {
                this.appendNumber(event.key);
            } else if (event.key === '.') {
                this.appendNumber('.');
            } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
                this.chooseOperation(event.key);
            } else if (event.key === 'Enter' || event.key === '=') {
                this.compute();
            } else if (event.key === 'Escape') {
                this.clear();
            } else if (event.key === 'Backspace') {
                this.delete();
            }
            this.updateDisplay();
        });
    }
}

// Initialize calculator
const calculator = new Calculator();

// Button click handlers
function appendNumber(number) {
    calculator.appendNumber(number);
    calculator.updateDisplay();
}

function setOperation(operation) {
    calculator.chooseOperation(operation);
    calculator.updateDisplay();
}

function calculate() {
    calculator.compute();
    calculator.updateDisplay();
}

function clearAll() {
    calculator.clear();
    calculator.updateDisplay();
}

function clearEntry() {
    calculator.currentOperand = '';
    calculator.updateDisplay();
}

function deleteLast() {
    calculator.delete();
    calculator.updateDisplay();
}

// Initialize display on page load
document.addEventListener('DOMContentLoaded', () => {
    calculator.updateDisplay();
});

// Add visual feedback for button presses
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
});

// Add keyboard visual feedback
document.addEventListener('keydown', (event) => {
    let buttonToHighlight = null;
    
    if (event.key >= '0' && event.key <= '9') {
        buttonToHighlight = document.querySelector(`[onclick="appendNumber('${event.key}')"]`);
    } else if (event.key === '.') {
        buttonToHighlight = document.querySelector(`[onclick="appendNumber('.')"]`);
    } else if (event.key === '+') {
        buttonToHighlight = document.querySelector(`[onclick="setOperation('+')"]`);
    } else if (event.key === '-') {
        buttonToHighlight = document.querySelector(`[onclick="setOperation('-')"]`);
    } else if (event.key === '*') {
        buttonToHighlight = document.querySelector(`[onclick="setOperation('*')"]`);
    } else if (event.key === '/') {
        buttonToHighlight = document.querySelector(`[onclick="setOperation('/')"]`);
    } else if (event.key === 'Enter' || event.key === '=') {
        buttonToHighlight = document.querySelector(`[onclick="calculate()"]`);
    } else if (event.key === 'Escape') {
        buttonToHighlight = document.querySelector(`[onclick="clearAll()"]`);
    } else if (event.key === 'Backspace') {
        buttonToHighlight = document.querySelector(`[onclick="deleteLast()"]`);
    }
    
    if (buttonToHighlight) {
        buttonToHighlight.style.transform = 'scale(0.95)';
        buttonToHighlight.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.4)';
        
        setTimeout(() => {
            buttonToHighlight.style.transform = 'scale(1)';
            buttonToHighlight.style.boxShadow = '';
        }, 150);
    }
});
