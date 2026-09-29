/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface NexusLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  animated?: boolean;
  withBackdrop?: boolean;
  className?: string;
  imageSrc?: string;
  onClick?: () => void;
}

export const NexusLogo: React.FC<NexusLogoProps> = ({
  size = 'md',
  animated = true,
  className = '',
  imageSrc = '/promt to pixel 1.jpeg',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Height configurations preserving the original 16:9 ratio of the uploaded image
  const sizeMap = {
    xs: 'h-7 w-auto max-w-[50px]',
    sm: 'h-10 w-auto max-w-[70px]',
    md: 'h-16 w-auto max-w-[120px]',
    lg: 'h-32 w-auto max-w-[240px]',
    hero: 'w-full max-w-[460px] h-auto',
  };

  const currentSizeClass = sizeMap[size];

  return (
    <div
      className={`inline-flex items-center justify-center select-none relative transition-transform duration-300 ${
        isHovered && animated ? 'scale-[1.02]' : ''
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Ambient Backlight Glow for the Logo */}
      <div
        className={`absolute inset-0 rounded-2xl bg-cyan-400/20 blur-2xl pointer-events-none transition-opacity duration-500 ${
          isHovered ? 'opacity-100 scale-105' : 'opacity-60'
        } ${animated ? 'animate-pulse' : ''}`}
      />

      {/* Official Logo Image */}
      <img
        src={imageSrc}
        alt="NexusFlow Official Logo"
        className={`relative z-10 object-contain rounded-xl filter drop-shadow-[0_0_25px_rgba(34,211,238,0.4)] ${currentSizeClass}`}
      />
    </div>
  );
};

export default NexusLogo;
