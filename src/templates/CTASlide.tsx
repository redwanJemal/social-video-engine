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

interface CTASlideProps {
  headline: string;
  subtext?: string;
  buttonText: string;
  theme: ThemeConfig;
}

export const CTASlide: React.FC<CTASlideProps> = ({
  headline,
  subtext,
  buttonText,
  theme,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const headSpr = spring({frame, fps, config: {damping: 12, stiffness: 100}});
  const subSpr = spring({frame: frame - 10, fps, config: {damping: 15}});
  const btnSpr = spring({frame: frame - 25, fps, config: {damping: 10, stiffness: 80}});

  // Pulsing button effect
  const pulse = interpolate(
    Math.sin((frame - 30) * 0.1),
    [-1, 1],
    [1, 1.05]
  );
  const btnScale = frame > 30 ? pulse : interpolate(btnSpr, [0, 1], [0.5, 1]);

  return (
    <Background theme={theme}>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 80px',
          gap: '40px',
        }}
      >
        {/* Headline */}
        <div
          style={{
            opacity: headSpr,
            transform: `scale(${interpolate(headSpr, [0, 1], [0.8, 1])})`,
            color: theme.textColor,
            fontSize: '64px',
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {headline}
        </div>

        {/* Subtext */}
        {subtext && (
          <div
            style={{
              opacity: subSpr,
              color: `${theme.textColor}aa`,
              fontSize: '32px',
              fontWeight: 400,
              textAlign: 'center',
              lineHeight: 1.5,
              maxWidth: '800px',
            }}
          >
            {subtext}
          </div>
        )}

        {/* CTA Button */}
        <div
          style={{
            opacity: btnSpr,
            transform: `scale(${btnScale})`,
            marginTop: '40px',
          }}
        >
          <div
            style={{
              background: theme.accentColor,
              color: '#000',
              fontSize: '36px',
              fontWeight: 800,
              padding: '24px 64px',
              borderRadius: '60px',
              boxShadow: `0 8px 40px ${theme.accentColor}66`,
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            {buttonText}
          </div>
        </div>

        {/* Arrow animation */}
        <div
          style={{
            opacity: btnSpr,
            transform: `translateY(${interpolate(
              Math.sin(frame * 0.15),
              [-1, 1],
              [-5, 5]
            )}px)`,
            color: `${theme.textColor}66`,
            fontSize: '40px',
            marginTop: '20px',
          }}
        >
          ↓
        </div>
      </AbsoluteFill>
    </Background>
  );
};
