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
    value: string;
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
  index: number;
}> = ({value, frame, fps, delay, theme, index}) => {
  const spr = spring({
    frame: frame - delay,
    fps,
    config: {damping: 20, stiffness: 80},
  });

  const numMatch = value.match(/(\d+\.?\d*)/);
  const targetNum = numMatch ? parseFloat(numMatch[1]) : 0;
  const currentNum = Math.round(interpolate(spr, [0, 1], [0, targetNum]));
  const displayValue = numMatch
    ? value.replace(numMatch[1], String(currentNum))
    : value;

  // Glow pulse after number lands
  const glowIntensity = frame > delay + 15
    ? interpolate(Math.sin((frame - delay) * 0.08), [-1, 1], [0.3, 0.7])
    : 0;

  // Gradient colors cycle through accent colors
  const colors = [
    [theme.accentColor, '#FB923C'],
    ['#A78BFA', '#818CF8'],
    ['#3B82F6', '#60A5FA'],
  ];
  const [c1, c2] = colors[index % 3];

  return (
    <div
      style={{
        opacity: spr,
        transform: `scale(${interpolate(spr, [0, 1], [0.7, 1])})`,
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${c1}, ${c2})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '80px',
          fontWeight: 900,
          lineHeight: 1,
          filter: `drop-shadow(0 0 ${20 + glowIntensity * 30}px ${c1}44)`,
        }}
      >
        {displayValue}
      </div>
    </div>
  );
};

// Orbital decoration
const Orbital: React.FC<{
  radius: number;
  speed: number;
  frame: number;
  color: string;
  size: number;
  offset: number;
}> = ({radius, speed, frame, color, size, offset}) => {
  const angle = (frame * speed + offset) * (Math.PI / 180);
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        transform: `translate(${x - size / 2}px, ${y - size / 2}px)`,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        opacity: 0.6,
      }}
    />
  );
};

export const StatCard: React.FC<StatCardProps> = ({stats, title, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleSpr = spring({frame, fps, config: {damping: 15}});

  // Orbit ring opacity
  const orbitOpacity = interpolate(frame, [0, 30], [0, 0.15], {
    extrapolateRight: 'clamp',
  });

  return (
    <Background theme={theme} variant="neural">
      {/* Orbital decorative elements */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: orbitOpacity,
        }}
      >
        {/* Orbit rings */}
        <div
          style={{
            position: 'absolute',
            width: 700,
            height: 700,
            borderRadius: '50%',
            border: `1px solid ${theme.accentColor}20`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            border: '1px solid rgba(167,139,250,0.12)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 900,
            height: 900,
            borderRadius: '50%',
            border: '1px solid rgba(59,130,246,0.08)',
          }}
        />
      </AbsoluteFill>

      {/* Floating orbital dots */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Orbital radius={250} speed={0.8} frame={frame} color={theme.accentColor} size={6} offset={0} />
        <Orbital radius={350} speed={-0.5} frame={frame} color="#A78BFA" size={5} offset={120} />
        <Orbital radius={300} speed={0.6} frame={frame} color="#3B82F6" size={4} offset={240} />
        <Orbital radius={200} speed={-0.9} frame={frame} color={theme.accentColor} size={3} offset={60} />
        <Orbital radius={400} speed={0.4} frame={frame} color="#A78BFA" size={5} offset={180} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 80px',
          gap: '40px',
        }}
      >
        {/* Title with tag styling */}
        {title && (
          <div
            style={{
              opacity: titleSpr,
              transform: `translateY(${interpolate(titleSpr, [0, 1], [-30, 0])}px)`,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: `${theme.accentColor}12`,
                border: `1px solid ${theme.accentColor}30`,
                padding: '8px 20px',
                borderRadius: '100px',
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: theme.accentColor,
                }}
              />
              <span
                style={{
                  color: theme.accentColor,
                  fontSize: '16px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}
              >
                {title}
              </span>
            </div>
          </div>
        )}

        {/* Stats row in glass cards */}
        <div
          style={{
            display: 'flex',
            gap: '30px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {stats.map((stat, i) => {
            const cardSpr = spring({
              frame: frame - (i * 12 + 8),
              fps,
              config: {damping: 15, stiffness: 100},
            });

            return (
              <div
                key={i}
                style={{
                  opacity: cardSpr,
                  transform: `translateY(${interpolate(cardSpr, [0, 1], [40, 0])}px) scale(${interpolate(cardSpr, [0, 1], [0.9, 1])})`,
                }}
              >
                {/* Glass card */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    padding: '36px 44px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    minWidth: '220px',
                  }}
                >
                  {/* Top glow border */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '20%',
                      right: '20%',
                      height: '2px',
                      background: `linear-gradient(90deg, transparent, ${[theme.accentColor, '#A78BFA', '#3B82F6'][i % 3]}, transparent)`,
                    }}
                  />

                  {/* Inner card glow */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-50%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '100px',
                      height: '100px',
                      background: `radial-gradient(circle, ${[theme.accentColor, '#A78BFA', '#3B82F6'][i % 3]}15 0%, transparent 70%)`,
                      borderRadius: '50%',
                    }}
                  />

                  <AnimatedNumber
                    value={stat.value}
                    frame={frame}
                    fps={fps}
                    delay={i * 12 + 10}
                    theme={theme}
                    index={i}
                  />

                  {/* Metric bar */}
                  <div
                    style={{
                      width: '60px',
                      height: '3px',
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${interpolate(cardSpr, [0, 1], [0, 100])}%`,
                        height: '100%',
                        background: [theme.accentColor, '#A78BFA', '#3B82F6'][i % 3],
                        borderRadius: '2px',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '18px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '3px',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Background>
  );
};
