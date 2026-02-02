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
  icon?: string;
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

  // Color palette for numbered items
  const itemColors = [theme.accentColor, '#A78BFA', '#3B82F6', '#22D3EE', '#FB923C'];

  return (
    <Background theme={theme}>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '80px 80px',
          gap: '24px',
        }}
      >
        {/* Title with gradient text */}
        <div
          style={{
            opacity: titleSpr,
            transform: `translateX(${interpolate(titleSpr, [0, 1], [-40, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: '52px',
              fontWeight: 900,
              lineHeight: 1.2,
              letterSpacing: '-2px',
              background: `linear-gradient(135deg, ${theme.textColor} 0%, ${theme.textColor}cc 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </div>
        </div>

        {/* Animated gradient divider */}
        <div
          style={{
            width: `${interpolate(titleSpr, [0, 1], [0, 200])}px`,
            height: '3px',
            background: `linear-gradient(90deg, ${theme.accentColor}, #A78BFA, transparent)`,
            borderRadius: '2px',
            marginBottom: '8px',
          }}
        />

        {/* List items as glass cards */}
        {items.map((item, i) => {
          const delay = 15 + i * 12;
          const spr = spring({
            frame: frame - delay,
            fps,
            config: {damping: 15, stiffness: 120},
          });

          const itemColor = itemColors[i % itemColors.length];

          // Blur-in effect
          const blurAmount = interpolate(spr, [0, 0.6, 1], [8, 2, 0]);

          return (
            <div
              key={i}
              style={{
                opacity: spr,
                transform: `translateX(${interpolate(spr, [0, 1], [80, 0])}px)`,
                filter: `blur(${blurAmount}px)`,
              }}
            >
              {/* Glass card item */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  padding: '18px 28px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Left accent bar */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '15%',
                    bottom: '15%',
                    width: '3px',
                    background: itemColor,
                    borderRadius: '0 2px 2px 0',
                    boxShadow: `0 0 12px ${itemColor}44`,
                  }}
                />

                {/* Number or icon circle */}
                <div
                  style={{
                    minWidth: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: `${itemColor}15`,
                    border: `1px solid ${itemColor}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '8px',
                  }}
                >
                  <span
                    style={{
                      color: itemColor,
                      fontSize: numbered ? '22px' : '24px',
                      fontWeight: 800,
                    }}
                  >
                    {numbered ? `${i + 1}` : icon}
                  </span>
                </div>

                {/* Item text */}
                <div
                  style={{
                    color: theme.textColor,
                    fontSize: '30px',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    flex: 1,
                  }}
                >
                  {item}
                </div>

                {/* Right chevron decoration */}
                <div
                  style={{
                    color: 'rgba(255,255,255,0.15)',
                    fontSize: '20px',
                    fontWeight: 300,
                  }}
                >
                  →
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </Background>
  );
};
