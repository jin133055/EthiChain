import React, { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;      // typing speed in ms per character
  cursor?: boolean;    // show blinking cursor
  className?: string;  // Tailwind or custom styles
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 50,
  cursor = true,
  className = ''
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text.charAt(index));
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return (
    <span className={`whitespace-nowrap ${className}`}>
      {displayedText}
      {cursor && <span className="border-r-2 border-white animate-blink ml-0.5">&nbsp;</span>}
    </span>
  );
};

export default TypewriterText;
