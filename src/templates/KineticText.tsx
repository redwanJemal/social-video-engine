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
  accentLineIndex?: number;
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

  // Accent line decoration animation
  const accentLineWidth = interpolate(frame, [5, 25], [0, 120], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <Background theme={theme}>
      {/* Decorative accent lines - left side */}
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: '30%',
          width: '3px',
          height: `${interpolate(frame, [0, 30], [0, 40], {extrapolateRight: 'clamp'})}%`,
          background: `linear-gradient(180deg, ${theme.accentColor}, transparent)`,
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: '35%',
          width: '2px',
          height: `${interpolate(frame, [5, 35], [0, 30], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'})}%`,
          background: 'linear-gradient(180deg, #A78BFA, transparent)',
          opacity: 0.2,
        }}
      />

      {/* Top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: accentLineWidth,
          height: '3px',
          background: `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)`,
          borderRadius: '2px',
        }}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          gap: '12px',
        }}
      >
        {lines.map((line, i) => {
          const delay = i * 8;
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
          const exitFrame = 90;
          const exitOpacity = interpolate(
            frame,
            [exitFrame, exitFrame + 15],
            [1, 0],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
          );

          const isAccent = i === accentLineIndex;

          // Blur trail effect: slight blur that clears as animation completes
          const blurAmount = interpolate(spr, [0, 0.7, 1], [12, 4, 0]);

          return (
            <div
              key={i}
              style={{
                transform,
                opacity: opacity * exitOpacity,
                filter: `blur(${blurAmount}px)`,
              }}
            >
              {/* Glassmorphism card wrapper */}
              <div
                style={{
                  background: isAccent
                    ? `linear-gradient(135deg, ${theme.accentColor}18, rgba(167,139,250,0.08))`
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isAccent ? `${theme.accentColor}44` : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '16px',
                  padding: '20px 40px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Inner glow for accent line */}
                {isAccent && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)`,
                    }}
                  />
                )}

                <div
                  style={{
                    color: isAccent ? 'transparent' : theme.textColor,
                    background: isAccent
                      ? `linear-gradient(135deg, ${theme.accentColor}, #FB923C, #A78BFA)`
                      : undefined,
                    backgroundClip: isAccent ? 'text' : undefined,
                    WebkitBackgroundClip: isAccent ? 'text' : undefined,
                    WebkitTextFillColor: isAccent ? 'transparent' : undefined,
                    fontSize: isAccent ? fontSize * 1.1 : fontSize,
                    fontWeight: 800,
                    lineHeight: 1.2,
                    textAlign: 'center',
                    letterSpacing: '-1px',
                  }}
                >
                  {line}
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Bottom accent bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: accentLineWidth,
          height: '3px',
          background: `linear-gradient(90deg, transparent, #A78BFA, transparent)`,
          borderRadius: '2px',
        }}
      />
    </Background>
  );
};
