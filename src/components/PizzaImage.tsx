'use client';

import { useState } from 'react';

interface PizzaImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function PizzaImage({ src, alt, className }: PizzaImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-8xl">
        🍕
      </div>
    );
  }

  return (
    <img 
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
