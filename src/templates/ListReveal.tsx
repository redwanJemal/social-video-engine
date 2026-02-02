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

interface ListRevealProps {
  title: string;
  items: string[];
  theme: ThemeConfig;
  icon?: string; // emoji
  numbered?: boolean;
}

export const ListReveal: React.FC<ListRevealProps> = ({
  title,
  items,
  theme,
  icon = '→',
  numbered = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleSpr = spring({frame, fps, config: {damping: 15, stiffness: 100}});

  return (
    <Background theme={theme}>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '120px 80px',
          gap: '40px',
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleSpr,
            transform: `translateX(${interpolate(titleSpr, [0, 1], [-40, 0])}px)`,
            color: theme.textColor,
            fontSize: '56px',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '20px',
          }}
        >
          {title}
        </div>

        {/* Divider line */}
        <div
          style={{
            width: `${interpolate(titleSpr, [0, 1], [0, 200])}px`,
            height: '4px',
            background: theme.accentColor,
            borderRadius: '2px',
            marginBottom: '10px',
          }}
        />

        {/* List items */}
        {items.map((item, i) => {
          const delay = 15 + i * 12;
          const spr = spring({
            frame: frame - delay,
            fps,
            config: {damping: 15, stiffness: 120},
          });

          return (
            <div
              key={i}
              style={{
                opacity: spr,
                transform: `translateX(${interpolate(spr, [0, 1], [60, 0])}px)`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
              }}
            >
              <div
                style={{
                  color: theme.accentColor,
                  fontSize: '36px',
                  fontWeight: 700,
                  minWidth: '40px',
                  textAlign: 'center',
                }}
              >
                {numbered ? `${i + 1}.` : icon}
              </div>
              <div
                style={{
                  color: theme.textColor,
                  fontSize: '36px',
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </Background>
  );
};
