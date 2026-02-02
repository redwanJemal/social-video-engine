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

interface StatCardProps {
  stats: Array<{
    value: string; // "85%", "$2.4M", "10x"
    label: string;
    prefix?: string;
    suffix?: string;
  }>;
  title?: string;
  theme: ThemeConfig;
}

const AnimatedNumber: React.FC<{
  value: string;
  frame: number;
  fps: number;
  delay: number;
  theme: ThemeConfig;
}> = ({value, frame, fps, delay, theme}) => {
  const spr = spring({
    frame: frame - delay,
    fps,
    config: {damping: 20, stiffness: 80},
  });

  // Extract numeric part for counting animation
  const numMatch = value.match(/(\d+\.?\d*)/);
  const targetNum = numMatch ? parseFloat(numMatch[1]) : 0;
  const currentNum = Math.round(interpolate(spr, [0, 1], [0, targetNum]));
  const displayValue = numMatch
    ? value.replace(numMatch[1], String(currentNum))
    : value;

  return (
    <div
      style={{
        opacity: spr,
        transform: `scale(${interpolate(spr, [0, 1], [0.7, 1])})`,
        color: theme.accentColor,
        fontSize: '96px',
        fontWeight: 900,
        lineHeight: 1,
        textShadow: `0 0 40px ${theme.accentColor}44`,
      }}
    >
      {displayValue}
    </div>
  );
};

export const StatCard: React.FC<StatCardProps> = ({stats, title, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleSpr = spring({frame, fps, config: {damping: 15}});

  return (
    <Background theme={theme}>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          gap: '60px',
        }}
      >
        {title && (
          <div
            style={{
              opacity: titleSpr,
              transform: `translateY(${interpolate(titleSpr, [0, 1], [-30, 0])}px)`,
              color: theme.textColor,
              fontSize: '42px',
              fontWeight: 600,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              marginBottom: '20px',
            }}
          >
            {title}
          </div>
        )}

        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <AnimatedNumber
              value={stat.value}
              frame={frame}
              fps={fps}
              delay={i * 15 + 10}
              theme={theme}
            />
            <div
              style={{
                color: `${theme.textColor}aa`,
                fontSize: '28px',
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: '4px',
                opacity: spring({
                  frame: frame - (i * 15 + 20),
                  fps,
                  config: {damping: 15},
                }),
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </AbsoluteFill>
    </Background>
  );
};
