import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {ThemeConfig} from '../types';

export const Background: React.FC<{
  theme: ThemeConfig;
  children: React.ReactNode;
}> = ({theme, children}) => {
  const frame = useCurrentFrame();

  // Subtle animated gradient shift
  const angle = interpolate(frame, [0, 300], [135, 145], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${theme.bgGradient[0]} 0%, ${theme.bgGradient[1]} 100%)`,
        fontFamily: theme.fontFamily,
        overflow: 'hidden',
      }}
    >
      {/* Subtle particle/grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          opacity: interpolate(frame, [0, 30], [0, 1], {extrapolateRight: 'clamp'}),
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
