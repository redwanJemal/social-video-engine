import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {ThemeConfig} from '../types';

export const Background: React.FC<{
  theme: ThemeConfig;
  children: React.ReactNode;
  variant?: 'default' | 'neural' | 'minimal';
}> = ({theme, children, variant = 'default'}) => {
  const frame = useCurrentFrame();

  // Subtle animated gradient angle
  const angle = interpolate(frame, [0, 300], [135, 155], {
    extrapolateRight: 'clamp',
  });

  // Noise grain opacity pulse
  const grainOpacity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.015, 0.03]
  );

  // Slow drift for radial gradients
  const drift1X = interpolate(frame, [0, 300], [70, 65], {
    extrapolateRight: 'clamp',
  });
  const drift1Y = interpolate(frame, [0, 300], [30, 35], {
    extrapolateRight: 'clamp',
  });
  const drift2X = interpolate(frame, [0, 300], [30, 35], {
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
      {/* Multi-layer radial gradients (neural-bg style) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: [
            `radial-gradient(circle at ${drift1X}% ${drift1Y}%, rgba(124,58,237,0.12) 0%, transparent 50%)`,
            `radial-gradient(circle at ${drift2X}% 70%, ${theme.accentColor}18 0%, transparent 50%)`,
            `radial-gradient(circle at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 60%)`,
          ].join(', '),
          opacity: interpolate(frame, [0, 20], [0, 1], {
            extrapolateRight: 'clamp',
          }),
        }}
      />

      {/* Secondary glow orbs */}
      {variant === 'neural' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '600px',
              height: '600px',
              background: `radial-gradient(circle, ${theme.accentColor}20 0%, transparent 70%)`,
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-30%',
              left: '-5%',
              width: '500px',
              height: '500px',
              background:
                'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />
        </>
      )}

      {/* Dot matrix pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: interpolate(frame, [0, 25], [0, 1], {
            extrapolateRight: 'clamp',
          }),
        }}
      />

      {/* Grid lines overlay (subtle) */}
      {variant !== 'minimal' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: [
              `linear-gradient(${theme.accentColor}06 1px, transparent 1px)`,
              `linear-gradient(90deg, ${theme.accentColor}06 1px, transparent 1px)`,
            ].join(', '),
            backgroundSize: '60px 60px',
            opacity: interpolate(frame, [0, 30], [0, 0.5], {
              extrapolateRight: 'clamp',
            }),
          }}
        />
      )}

      {/* Noise/grain texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          opacity: grainOpacity,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Corner accent lines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: `${interpolate(frame, [0, 20], [0, 200], {extrapolateRight: 'clamp'})}px`,
          height: '3px',
          background: `linear-gradient(90deg, transparent, ${theme.accentColor})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '3px',
          height: `${interpolate(frame, [0, 20], [0, 200], {extrapolateRight: 'clamp'})}px`,
          background: `linear-gradient(180deg, ${theme.accentColor}, transparent)`,
        }}
      />

      {/* Bottom gradient line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '3px',
          background: `linear-gradient(90deg, ${theme.accentColor}, rgba(167,139,250,0.8), rgba(59,130,246,0.8), transparent)`,
          opacity: interpolate(frame, [0, 15], [0, 1], {
            extrapolateRight: 'clamp',
          }),
        }}
      />

      {children}
    </AbsoluteFill>
  );
};
