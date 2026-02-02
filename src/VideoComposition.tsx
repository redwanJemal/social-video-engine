import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import type {SceneConfig, ThemeConfig} from './types';
import {KineticText} from './templates/KineticText';
import {StatCard} from './templates/StatCard';
import {ListReveal} from './templates/ListReveal';
import {QuoteCard} from './templates/QuoteCard';
import {CTASlide} from './templates/CTASlide';
import {IntroSlide} from './templates/IntroSlide';

interface VideoCompositionProps {
  scenes: SceneConfig[];
  theme: ThemeConfig;
}

const SceneRenderer: React.FC<{scene: SceneConfig; theme: ThemeConfig}> = ({
  scene,
  theme,
}) => {
  switch (scene.type) {
    case 'intro':
      return <IntroSlide theme={theme} {...scene.props} />;
    case 'kinetic-text':
      return <KineticText theme={theme} {...scene.props} />;
    case 'stat-card':
      return <StatCard theme={theme} {...scene.props} />;
    case 'list-reveal':
      return <ListReveal theme={theme} {...scene.props} />;
    case 'quote-card':
      return <QuoteCard theme={theme} {...scene.props} />;
    case 'cta':
      return <CTASlide theme={theme} {...scene.props} />;
    default:
      return (
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000',
            color: '#fff',
            fontSize: 40,
          }}
        >
          Unknown scene type: {scene.type}
        </AbsoluteFill>
      );
  }
};

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  scenes,
  theme,
}) => {
  let currentFrame = 0;

  return (
    <AbsoluteFill>
      {scenes.map((scene, i) => {
        const from = currentFrame;
        currentFrame += scene.duration;

        return (
          <Sequence key={i} from={from} durationInFrames={scene.duration}>
            <SceneRenderer scene={scene} theme={theme} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
