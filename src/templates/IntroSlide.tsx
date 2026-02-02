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

interface IntroSlideProps {
  hook: string;
  subtitle?: string;
  theme: ThemeConfig;
}

export const IntroSlide: React.FC<IntroSlideProps> = ({
  hook,
  subtitle,
  theme,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Dramatic entrance
  const hookScale = spring({
    frame,
    fps,
    config: {damping: 8, stiffness: 60, mass: 1.2},
  });

  const subtitleSpr = spring({
    frame: frame - 20,
    fps,
    config: {damping: 15, stiffness: 100},
  });

  // Glowing accent ring
  const ringSize = interpolate(frame, [0, 20], [0, 600], {
    extrapolateRight: 'clamp',
  });
  const ringOpacity = interpolate(frame, [0, 10, 20], [0, 0.3, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <Background theme={theme}>
      {/* Expanding ring effect */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: `${ringSize}px`,
            height: `${ringSize}px`,
            borderRadius: '50%',
            border: `3px solid ${theme.accentColor}`,
            opacity: ringOpacity,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          gap: '30px',
        }}
      >
        {/* Hook text - big and dramatic */}
        <div
          style={{
            transform: `scale(${interpolate(hookScale, [0, 1], [1.5, 1])})`,
            opacity: hookScale,
            color: theme.textColor,
            fontSize: '80px',
            fontWeight: 900,
            textAlign: 'center',
            lineHeight: 1.1,
            textShadow: `0 0 60px ${theme.accentColor}33`,
            letterSpacing: '-2px',
          }}
        >
          {hook}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              opacity: subtitleSpr,
              transform: `translateY(${interpolate(subtitleSpr, [0, 1], [20, 0])}px)`,
              color: theme.accentColor,
              fontSize: '32px',
              fontWeight: 500,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '6px',
            }}
          >
            {subtitle}
          </div>
        )}
      </AbsoluteFill>
    </Background>
  );
};
