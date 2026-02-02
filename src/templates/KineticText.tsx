import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Background} from '../components/Background';
import type {ThemeConfig} from '../types';

interface KineticTextProps {
  lines: string[];
  theme: ThemeConfig;
  accentLineIndex?: number; // Which line gets the accent color
  fontSize?: number;
  animation?: 'slide-up' | 'fade-in' | 'scale-in' | 'typewriter';
}

export const KineticText: React.FC<KineticTextProps> = ({
  lines,
  theme,
  accentLineIndex = -1,
  fontSize = 72,
  animation = 'slide-up',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <Background theme={theme}>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          gap: '16px',
        }}
      >
        {lines.map((line, i) => {
          const delay = i * 8; // Stagger each line
          const spr = spring({
            frame: frame - delay,
            fps,
            config: {damping: 15, stiffness: 120, mass: 0.8},
          });

          let transform = '';
          let opacity = 1;

          switch (animation) {
            case 'slide-up':
              transform = `translateY(${interpolate(spr, [0, 1], [60, 0])}px)`;
              opacity = spr;
              break;
            case 'fade-in':
              opacity = spr;
              break;
            case 'scale-in':
              transform = `scale(${interpolate(spr, [0, 1], [0.5, 1])})`;
              opacity = spr;
              break;
            case 'typewriter':
              opacity = frame > delay ? 1 : 0;
              break;
          }

          // Exit animation
          const exitFrame = 90; // Start exit 3 seconds in
          const exitOpacity = interpolate(
            frame,
            [exitFrame, exitFrame + 15],
            [1, 0],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
          );

          const isAccent = i === accentLineIndex;

          return (
            <div
              key={i}
              style={{
                transform,
                opacity: opacity * exitOpacity,
                color: isAccent ? theme.accentColor : theme.textColor,
                fontSize: isAccent ? fontSize * 1.1 : fontSize,
                fontWeight: 800,
                lineHeight: 1.2,
                textAlign: 'center',
                textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                letterSpacing: '-1px',
              }}
            >
              {line}
            </div>
          );
        })}
      </AbsoluteFill>
    </Background>
  );
};
