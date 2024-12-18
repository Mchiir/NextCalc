'use client';

import { useState } from 'react';
import '../../styles/globals.css'; // Adjust the path if needed

export default function Calculator2() {
  const [input, setInput] = useState('');

  const handleButtonClick = (value: string) => {
    if (value === 'C') {
      setInput('');
    } else if (value === '=') {
      try {
        setInput(eval(input).toString());
      } catch {
        setInput('Error');
      }
    } else {
      setInput((prev) => prev + value);
    }
  };

  const buttons = [
    'C', '±', '%', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '=',
  ];

  return (
    <div className="calculator-wrapper">
      <div className="calculator">
        <div className="display">{input || '0'}</div>
        <div className="buttons">
          {buttons.map((button, index) => (
            <button
              key={index}
              className="calc-button"
              onClick={() => button && handleButtonClick(button)}
            >
              {button}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
