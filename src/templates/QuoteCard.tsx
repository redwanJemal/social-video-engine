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

interface QuoteCardProps {
  quote: string;
  author: string;
  role?: string;
  theme: ThemeConfig;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  author,
  role,
  theme,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const quoteSpr = spring({frame, fps, config: {damping: 20, stiffness: 80}});
  const authorSpr = spring({
    frame: frame - 20,
    fps,
    config: {damping: 15, stiffness: 100},
  });
  const quoteMarkSpr = spring({
    frame: frame - 5,
    fps,
    config: {damping: 10, stiffness: 60},
  });

  // Gradient accent bar width animation
  const accentBarWidth = interpolate(frame, [0, 30], [0, 4], {
    extrapolateRight: 'clamp',
  });
  const accentBarHeight = interpolate(frame, [10, 40], [0, 100], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Subtle glow pulse on quote marks
  const markGlow = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.08, 0.2]
  );

  return (
    <Background theme={theme} variant="minimal">
      {/* Left gradient accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: '15%',
          width: accentBarWidth,
          height: `${accentBarHeight}%`,
          background: `linear-gradient(180deg, ${theme.accentColor}, #A78BFA, #3B82F6)`,
          borderRadius: '4px',
          boxShadow: `0 0 20px ${theme.accentColor}33`,
          maxHeight: '70%',
        }}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 120px',
          gap: '40px',
        }}
      >
        {/* Large decorative opening quote mark */}
        <div
          style={{
            position: 'absolute',
            top: 120,
            left: 100,
            opacity: quoteMarkSpr * markGlow,
            transform: `scale(${interpolate(quoteMarkSpr, [0, 1], [0.3, 1])})`,
          }}
        >
          <div
            style={{
              fontSize: '280px',
              fontWeight: 900,
              lineHeight: 0.6,
              background: `linear-gradient(135deg, ${theme.accentColor}, #A78BFA)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            "
          </div>
        </div>

        {/* Large decorative closing quote mark */}
        <div
          style={{
            position: 'absolute',
            bottom: 140,
            right: 100,
            opacity: quoteMarkSpr * markGlow * 0.6,
            transform: `scale(${interpolate(quoteMarkSpr, [0, 1], [0.3, 0.8])}) rotate(180deg)`,
          }}
        >
          <div
            style={{
              fontSize: '200px',
              fontWeight: 900,
              lineHeight: 0.6,
              background: `linear-gradient(135deg, #3B82F6, #A78BFA)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            "
          </div>
        </div>

        {/* Quote text in glass card */}
        <div
          style={{
            opacity: quoteSpr,
            transform: `translateY(${interpolate(quoteSpr, [0, 1], [30, 0])}px)`,
            zIndex: 1,
            maxWidth: '900px',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px',
              padding: '40px 50px',
              position: 'relative',
            }}
          >
            {/* Top glow line on card */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${theme.accentColor}66, transparent)`,
              }}
            />

            <div
              style={{
                color: theme.textColor,
                fontSize: '44px',
                fontWeight: 600,
                lineHeight: 1.5,
                textAlign: 'center',
                fontStyle: 'italic',
                letterSpacing: '-0.5px',
              }}
            >
              "{quote}"
            </div>
          </div>
        </div>

        {/* Gradient divider line */}
        <div
          style={{
            width: `${interpolate(authorSpr, [0, 1], [0, 120])}px`,
            height: '3px',
            background: `linear-gradient(90deg, ${theme.accentColor}, #A78BFA)`,
            borderRadius: '2px',
            boxShadow: `0 0 10px ${theme.accentColor}33`,
          }}
        />

        {/* Author section */}
        <div
          style={{
            opacity: authorSpr,
            transform: `translateY(${interpolate(authorSpr, [0, 1], [15, 0])}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Avatar placeholder circle */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.accentColor}30, rgba(167,139,250,0.2))`,
              border: `2px solid ${theme.accentColor}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 800,
              color: theme.accentColor,
            }}
          >
            {author.charAt(0).toUpperCase()}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            {/* Author name with gradient */}
            <div
              style={{
                background: `linear-gradient(135deg, ${theme.accentColor}, #FB923C)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '28px',
                fontWeight: 700,
              }}
            >
              {author}
            </div>
            {role && (
              <div
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '18px',
                  fontWeight: 400,
                  letterSpacing: '1px',
                }}
              >
                {role}
              </div>
            )}
          </div>
        </div>
      </AbsoluteFill>
    </Background>
  );
};
