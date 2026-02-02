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

// Floating particle for CTA slide
const FloatingParticle: React.FC<{
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  frame: number;
  delay: number;
}> = ({x, y, size, speed, color, frame, delay}) => {
  const yDrift = Math.sin((frame + delay * 10) * speed * 0.04) * 20;
  const xDrift = Math.cos((frame + delay * 7) * speed * 0.03) * 12;
  const opacity = interpolate(
    frame,
    [delay, delay + 15],
    [0, 0.4],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        opacity,
        transform: `translate(${xDrift}px, ${yDrift}px)`,
        boxShadow: `0 0 ${size * 4}px ${color}`,
      }}
    />
  );
};

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

  // Pulsing gradient button effect
  const pulse = interpolate(
    Math.sin((frame - 30) * 0.1),
    [-1, 1],
    [1, 1.06]
  );
  const btnScale = frame > 30 ? pulse : interpolate(btnSpr, [0, 1], [0.5, 1]);

  // Button glow intensity
  const glowPulse = interpolate(
    Math.sin((frame - 30) * 0.08),
    [-1, 1],
    [30, 50]
  );

  // Urgency shake effect (starts at frame 60)
  const urgencyShake = frame > 60
    ? Math.sin(frame * 0.8) * interpolate(frame, [60, 90], [0, 2], {extrapolateRight: 'clamp'})
    : 0;

  // Center glow
  const centerGlowSize = interpolate(frame, [20, 50], [0, 300], {
    extrapolateRight: 'clamp',
  });
  const centerGlowOpacity = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1],
    [0.08, 0.15]
  );

  // Particles
  const particles = [
    {x: 10, y: 15, size: 4, speed: 1.2, delay: 3},
    {x: 88, y: 20, size: 3, speed: 0.9, delay: 8},
    {x: 20, y: 80, size: 5, speed: 1.0, delay: 5},
    {x: 75, y: 75, size: 3, speed: 1.3, delay: 12},
    {x: 45, y: 8, size: 4, speed: 0.8, delay: 2},
    {x: 5, y: 50, size: 3, speed: 1.1, delay: 15},
    {x: 95, y: 45, size: 4, speed: 0.7, delay: 10},
    {x: 60, y: 92, size: 3, speed: 1.0, delay: 7},
    {x: 30, y: 30, size: 3, speed: 0.9, delay: 18},
    {x: 82, y: 60, size: 4, speed: 1.1, delay: 4},
  ];

  return (
    <Background theme={theme} variant="neural">
      {/* Floating particles */}
      {particles.map((p, i) => (
        <FloatingParticle
          key={i}
          x={p.x}
          y={p.y}
          size={p.size}
          speed={p.speed}
          color={i % 3 === 0 ? theme.accentColor : i % 3 === 1 ? '#A78BFA' : '#3B82F6'}
          frame={frame}
          delay={p.delay}
        />
      ))}

      {/* Center glow behind button */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: centerGlowSize,
            height: centerGlowSize,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.accentColor}${Math.round(centerGlowOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
            filter: 'blur(30px)',
            position: 'absolute',
            marginTop: '60px',
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
          gap: '32px',
        }}
      >
        {/* Headline with gradient text */}
        <div
          style={{
            opacity: headSpr,
            transform: `scale(${interpolate(headSpr, [0, 1], [0.8, 1])}) translateX(${urgencyShake}px)`,
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 900,
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: '-2px',
              background: `linear-gradient(135deg, ${theme.textColor} 0%, ${theme.textColor} 60%, ${theme.accentColor} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 0 30px ${theme.accentColor}22)`,
            }}
          >
            {headline}
          </div>
        </div>

        {/* Subtext in subdued glass card */}
        {subtext && (
          <div
            style={{
              opacity: subSpr,
              transform: `translateY(${interpolate(subSpr, [0, 1], [15, 0])}px)`,
              maxWidth: '800px',
            }}
          >
            <div
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '28px',
                fontWeight: 400,
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              {subtext}
            </div>
          </div>
        )}

        {/* CTA Button with gradient and glow */}
        <div
          style={{
            opacity: btnSpr,
            transform: `scale(${btnScale})`,
            marginTop: '30px',
          }}
        >
          <div
            style={{
              position: 'relative',
            }}
          >
            {/* Button glow shadow */}
            <div
              style={{
                position: 'absolute',
                inset: '-4px',
                borderRadius: '64px',
                background: `linear-gradient(135deg, ${theme.accentColor}, #FB923C, #A78BFA)`,
                filter: `blur(${glowPulse}px)`,
                opacity: 0.5,
              }}
            />
            {/* Button body */}
            <div
              style={{
                position: 'relative',
                background: `linear-gradient(135deg, ${theme.accentColor}, #FB923C)`,
                color: '#000',
                fontSize: '34px',
                fontWeight: 800,
                padding: '24px 64px',
                borderRadius: '60px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                boxShadow: `0 0 ${glowPulse}px ${theme.accentColor}88`,
              }}
            >
              {buttonText}
            </div>
          </div>
        </div>

        {/* Animated arrow with gradient */}
        <div
          style={{
            opacity: btnSpr * 0.5,
            transform: `translateY(${interpolate(
              Math.sin(frame * 0.15),
              [-1, 1],
              [-8, 8]
            )}px)`,
            marginTop: '10px',
          }}
        >
          <div
            style={{
              fontSize: '36px',
              background: `linear-gradient(180deg, ${theme.accentColor}66, transparent)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ↓
          </div>
        </div>
      </AbsoluteFill>
    </Background>
  );
};
