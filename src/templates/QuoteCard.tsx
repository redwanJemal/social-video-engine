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

  // Animated quotation mark
  const quoteMarkSpr = spring({
    frame: frame - 5,
    fps,
    config: {damping: 10, stiffness: 60},
  });

  return (
    <Background theme={theme}>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 80px',
          gap: '50px',
        }}
      >
        {/* Big quotation mark */}
        <div
          style={{
            opacity: quoteMarkSpr * 0.15,
            transform: `scale(${interpolate(quoteMarkSpr, [0, 1], [0.3, 1])})`,
            color: theme.accentColor,
            fontSize: '300px',
            fontWeight: 900,
            lineHeight: 0.6,
            position: 'absolute',
            top: '200px',
            left: '60px',
          }}
        >
          "
        </div>

        {/* Quote text */}
        <div
          style={{
            opacity: quoteSpr,
            transform: `translateY(${interpolate(quoteSpr, [0, 1], [30, 0])}px)`,
            color: theme.textColor,
            fontSize: '48px',
            fontWeight: 600,
            lineHeight: 1.5,
            textAlign: 'center',
            fontStyle: 'italic',
            maxWidth: '900px',
            zIndex: 1,
          }}
        >
          "{quote}"
        </div>

        {/* Divider */}
        <div
          style={{
            width: `${interpolate(authorSpr, [0, 1], [0, 80])}px`,
            height: '3px',
            background: theme.accentColor,
            borderRadius: '2px',
          }}
        />

        {/* Author */}
        <div
          style={{
            opacity: authorSpr,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              color: theme.accentColor,
              fontSize: '32px',
              fontWeight: 700,
            }}
          >
            {author}
          </div>
          {role && (
            <div
              style={{
                color: `${theme.textColor}88`,
                fontSize: '24px',
                fontWeight: 400,
              }}
            >
              {role}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </Background>
  );
};
