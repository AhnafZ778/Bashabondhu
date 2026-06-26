"use client";

import React, { useState, useEffect } from "react";

interface TypewriterProps {
  content: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  skip?: boolean;
}

export default function Typewriter({ content, speed = 20, onComplete, className = "", skip = false }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (skip) {
      setDisplayedText(content);
      if (onComplete) onComplete();
      return;
    }

    let index = 0;
    setDisplayedText("");
    
    const timer = setInterval(() => {
      if (index < content.length) {
        setDisplayedText(content.substring(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [content, speed, onComplete, skip]);

  // Helper to parse **bold** and incomplete **bold text
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*\*.*)/);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
        return (
          <strong key={i} className="text-emerald-600 bg-emerald-600/10 px-1 rounded font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("**")) {
        return (
          <strong key={i} className="text-emerald-600 bg-emerald-600/10 px-1 rounded font-bold">
            {part.slice(2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {renderText(displayedText)}
      {displayedText.length < content.length && !skip && (
        <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-emerald-600 animate-pulse align-middle"></span>
      )}
    </div>
  );
}
