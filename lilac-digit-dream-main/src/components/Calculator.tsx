import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(display);
    } else if (operation) {
      const currentValue = parseFloat(previousValue);
      let result: number;

      switch (operation) {
        case "+":
          result = currentValue + inputValue;
          break;
        case "-":
          result = currentValue - inputValue;
          break;
        case "×":
          result = currentValue * inputValue;
          break;
        case "÷":
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        default:
          result = inputValue;
      }

      setDisplay(String(result));
      setPreviousValue(String(result));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, operation, previousValue]);

  const calculate = useCallback(() => {
    if (!operation || previousValue === null) return;

    const inputValue = parseFloat(display);
    const currentValue = parseFloat(previousValue);
    let result: number;

    switch (operation) {
      case "+":
        result = currentValue + inputValue;
        break;
      case "-":
        result = currentValue - inputValue;
        break;
      case "×":
        result = currentValue * inputValue;
        break;
      case "÷":
        result = inputValue !== 0 ? currentValue / inputValue : 0;
        break;
      default:
        result = inputValue;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  }, [display, operation, previousValue]);

  const squareRoot = useCallback(() => {
    const value = parseFloat(display);
    if (value >= 0) {
      setDisplay(String(Math.sqrt(value)));
      setWaitingForOperand(true);
    }
  }, [display]);

  const percentage = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
    setWaitingForOperand(true);
  }, [display]);

  const toggleSign = useCallback(() => {
    setDisplay(String(parseFloat(display) * -1));
  }, [display]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        inputDigit(e.key);
      } else if (e.key === ".") {
        inputDecimal();
      } else if (e.key === "+" || e.key === "-") {
        performOperation(e.key);
      } else if (e.key === "*") {
        performOperation("×");
      } else if (e.key === "/") {
        e.preventDefault();
        performOperation("÷");
      } else if (e.key === "Enter" || e.key === "=") {
        calculate();
      } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
        clear();
      } else if (e.key === "Backspace") {
        setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputDigit, inputDecimal, performOperation, calculate, clear, display]);

  const Button = ({
    children,
    onClick,
    variant = "default",
    className,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "operator" | "function" | "equals";
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "calc-button",
        variant === "operator" && "calc-button-operator",
        variant === "function" && "calc-button-function",
        variant === "equals" && "calc-button-equals",
        className
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="calc-container">
      <div className="calc-display-container">
        <div className="calc-operation">
          {previousValue && operation && `${previousValue} ${operation}`}
        </div>
        <div className="calc-display">{display}</div>
      </div>

      <div className="calc-buttons">
        <Button onClick={clear} variant="function">
          C
        </Button>
        <Button onClick={squareRoot} variant="function">
          √
        </Button>
        <Button onClick={percentage} variant="function">
          %
        </Button>
        <Button onClick={() => performOperation("÷")} variant="operator">
          ÷
        </Button>

        <Button onClick={() => inputDigit("7")}>7</Button>
        <Button onClick={() => inputDigit("8")}>8</Button>
        <Button onClick={() => inputDigit("9")}>9</Button>
        <Button onClick={() => performOperation("×")} variant="operator">
          ×
        </Button>

        <Button onClick={() => inputDigit("4")}>4</Button>
        <Button onClick={() => inputDigit("5")}>5</Button>
        <Button onClick={() => inputDigit("6")}>6</Button>
        <Button onClick={() => performOperation("-")} variant="operator">
          −
        </Button>

        <Button onClick={() => inputDigit("1")}>1</Button>
        <Button onClick={() => inputDigit("2")}>2</Button>
        <Button onClick={() => inputDigit("3")}>3</Button>
        <Button onClick={() => performOperation("+")} variant="operator">
          +
        </Button>

        <Button onClick={() => inputDigit("0")}>
          0
        </Button>
        <Button onClick={inputDecimal}>.</Button>
        <Button onClick={calculate} variant="equals">
          =
        </Button>
      </div>
    </div>
  );
};

export default Calculator;
