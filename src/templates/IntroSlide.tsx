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

// Particle component for floating dots
const Particle: React.FC<{
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
  frame: number;
}> = ({x, y, size, delay, color, frame}) => {
  const drift = Math.sin((frame + delay * 10) * 0.03) * 15;
  const driftY = Math.cos((frame + delay * 7) * 0.025) * 10;
  const opacity = interpolate(
    frame,
    [delay, delay + 15, delay + 200],
    [0, 0.6, 0.3],
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
        transform: `translate(${drift}px, ${driftY}px)`,
        boxShadow: `0 0 ${size * 3}px ${color}`,
      }}
    />
  );
};

export const IntroSlide: React.FC<IntroSlideProps> = ({
  hook,
  subtitle,
  theme,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Dramatic entrance with scale-down
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

  // Expanding glow ring
  const ringSize = interpolate(frame, [0, 25], [0, 700], {
    extrapolateRight: 'clamp',
  });
  const ringOpacity = interpolate(frame, [0, 8, 25], [0, 0.4, 0], {
    extrapolateRight: 'clamp',
  });

  // Second ring (delayed)
  const ring2Size = interpolate(frame, [8, 35], [0, 600], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const ring2Opacity = interpolate(frame, [8, 16, 35], [0, 0.25, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Center glow pulse
  const glowPulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.15, 0.35]);
  const glowSize = interpolate(frame, [0, 30], [100, 400], {
    extrapolateRight: 'clamp',
  });

  // Particles data (deterministic positions)
  const particles = [
    {x: 12, y: 18, size: 3, delay: 5},
    {x: 85, y: 22, size: 4, delay: 10},
    {x: 25, y: 75, size: 3, delay: 8},
    {x: 72, y: 80, size: 5, delay: 12},
    {x: 50, y: 10, size: 3, delay: 3},
    {x: 8, y: 55, size: 4, delay: 15},
    {x: 92, y: 50, size: 3, delay: 7},
    {x: 40, y: 90, size: 4, delay: 18},
    {x: 65, y: 15, size: 3, delay: 20},
    {x: 18, y: 40, size: 3, delay: 11},
    {x: 78, y: 60, size: 4, delay: 6},
    {x: 55, y: 85, size: 3, delay: 14},
  ];

  return (
    <Background theme={theme} variant="neural">
      {/* Floating particles */}
      {particles.map((p, i) => (
        <Particle
          key={i}
          x={p.x}
          y={p.y}
          size={p.size}
          delay={p.delay}
          color={i % 3 === 0 ? theme.accentColor : i % 3 === 1 ? '#A78BFA' : '#3B82F6'}
          frame={frame}
        />
      ))}

      {/* Center glow orb */}
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
            width: glowSize,
            height: glowSize,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.accentColor}${Math.round(glowPulse * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
        />
      </AbsoluteFill>

      {/* Expanding ring effect 1 */}
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
            width: ringSize,
            height: ringSize,
            borderRadius: '50%',
            border: `2px solid ${theme.accentColor}`,
            opacity: ringOpacity,
            boxShadow: `0 0 30px ${theme.accentColor}44, inset 0 0 30px ${theme.accentColor}22`,
          }}
        />
      </AbsoluteFill>

      {/* Expanding ring effect 2 */}
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
            width: ring2Size,
            height: ring2Size,
            borderRadius: '50%',
            border: '2px solid #A78BFA',
            opacity: ring2Opacity,
            boxShadow: '0 0 20px rgba(167,139,250,0.3)',
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
        {/* Hook text with gradient effect */}
        <div
          style={{
            transform: `scale(${interpolate(hookScale, [0, 1], [1.5, 1])})`,
            opacity: hookScale,
            fontSize: '80px',
            fontWeight: 900,
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: '-2px',
            background: `linear-gradient(135deg, ${theme.textColor} 0%, ${theme.textColor} 40%, ${theme.accentColor} 60%, #A78BFA 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 40px ${theme.accentColor}33)`,
          }}
        >
          {hook}
        </div>

        {/* Subtitle with badge styling */}
        {subtitle && (
          <div
            style={{
              opacity: subtitleSpr,
              transform: `translateY(${interpolate(subtitleSpr, [0, 1], [20, 0])}px)`,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: `${theme.accentColor}18`,
                border: `1px solid ${theme.accentColor}44`,
                padding: '12px 28px',
                borderRadius: '100px',
              }}
            >
              {/* Dot indicator */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: theme.accentColor,
                  boxShadow: `0 0 10px ${theme.accentColor}`,
                }}
              />
              <span
                style={{
                  color: theme.accentColor,
                  fontSize: '24px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '4px',
                }}
              >
                {subtitle}
              </span>
            </div>
          </div>
        )}
      </AbsoluteFill>
    </Background>
  );
};
