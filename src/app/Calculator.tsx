'use client';

import { useEffect, useState } from 'react';
import '../../styles/globals.css'; // Adjust the path if needed

export default function Calculator() {

  const [input, setInput] = useState('0');
  const [error, setError] = useState<string | null>("");
  const minLength = 3;
  const maxLength = 11;
  
  const padInput = (input: string): string => {
    // Ensure the input has a minimum length of 3 by padding with spaces
    return input.length >= minLength ? input : input.padEnd(minLength, '');
  };

  const handleButtonClick = (value: string) => {
    setError(null); // Clear any existing error messages

    if (input.length >= maxLength) {
      setError(`Input cannot exceed ${maxLength} characters.`)
      return;
    }

    switch (value) {
      case 'C':
      case 'Delete':
        setInput(''); // Clear the input
        break;

      case '=':
      case 'Enter':
        calculateResult()
        break;

      case '±':
        // Negate the current input by multiplying by -1
        if (input) {
          const negatedValue = (parseFloat(input) * -1).toString();
          setInput(negatedValue.length <= maxLength ? negatedValue : negatedValue.slice(0, maxLength));
        }
        break;

      case 'Backspace':
        setInput((prev) => padInput(prev.slice(0, -1))); // Remove the last character
        break;

      default:
        if (/[\d+\-*/.%]/.test(value)) {
          setInput((prev) => {
            const updated = prev.length < maxLength ? prev + value : prev;
            return padInput(updated);
          });
        }
        break;
    }
  };

  const calculateResult = async () => {
    const [number1, operation, number2] = parseInput(input);
    if (number1 === null || number2 === null || !operation) {
      setError('Invalid expression');
      return;
    }

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number1, number2, operation }),
      });

      const data = await response.json();
      if (response.ok) {
        let result = data.result.toString()

        if (result.length > maxLength) {
          result = result.slice(0, maxLength); // Trim the result to maxLength
        }
        setInput(result);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (error) {
      setError('An error occurred while calculating');
    }
  };

  const parseInput = (input: string) => {
    const regex = /(-?\d*\.?\d+)([\+\-\*\/%])(-?\d*\.?\d+)/; // Updated regex to include modulus
    const match = input.match(regex);
    if (match) {
      const number1 = parseFloat(match[1]);
      const operation = match[2] === '+' ? 'add' :
                        match[2] === '-' ? 'subtract' :
                        match[2] === '*' ? 'multiply' :
                        match[2] === '/' ? 'divide' : 'modulus'; // Handle modulus
      const number2 = parseFloat(match[3]);
      return [number1, operation, number2];
    }
    return [null, null, null];
  };

  // keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (/[\d+\-*/.%]|Enter|Backspace|Delete/.test(e.key)) {
        handleButtonClick(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress); // Cleanup
  }, []);

  const buttons = [
    'C', '±', '%', '×',
    '7', '8', '9', '-',
    '4', '5', '6', '+',
    '1', '2', '3', '=',
    '0', '.', '',
  ];

  return (
    <div className="calculator-wrapper">
     <p className="error">{error}</p>
      <section className='calculator-container'>
        <div className="display">{input || '0'}</div>
        <div className="calculator">
          <div className="buttons">
            <button type='button' className='operator' onClick={() => handleButtonClick('C')}>C</button>
            <button type='button' className='operator' onClick={() => handleButtonClick('±')}>±</button>
            <button type='button' className='operator' onClick={() => handleButtonClick('%')}>%</button>
            <button type='button' className='operator' onClick={() => handleButtonClick('/')}>÷</button>

            <button type='button' className='operand' onClick={() => handleButtonClick('7')}>7</button>
            <button type='button' className='operand' onClick={() => handleButtonClick('8')}>8</button>
            <button type='button' className='operand' onClick={() => handleButtonClick('9')}>9</button>
            <button type='button' className='operator' onClick={() => handleButtonClick('*')}>×</button>

            <button type='button' className='operand' onClick={() => handleButtonClick('4')}>4</button>
            <button type='button' className='operand' onClick={() => handleButtonClick('5')}>5</button>
            <button type='button' className='operand' onClick={() => handleButtonClick('6')}>6</button>
            <button type='button' className='operator' onClick={() => handleButtonClick('-')}>-</button>

            <button type='button' className='operand' onClick={() => handleButtonClick('1')}>1</button>
            <button type='button' className='operand' onClick={() => handleButtonClick('2')}>2</button>
            <button type='button' className='operand' onClick={() => handleButtonClick('3')}>3</button>
            <button type='button' className='operator' onClick={() => handleButtonClick('+')}>+</button>

            <button type='button' className='operand' onClick={() => handleButtonClick('0')}>0</button>
            <button type='button' className='operand' onClick={() => handleButtonClick('.')}>.</button>

            <button type='button' className='operator' id='equalSign' onClick={() => handleButtonClick('=')}>=</button>
          </div>
        </div>
      </section>
    </div>
  );
}
