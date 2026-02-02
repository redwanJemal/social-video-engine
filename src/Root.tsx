import React from 'react';
import {Composition, staticFile} from 'remotion';
import {VideoComposition} from './VideoComposition';
import {THEMES} from './types';
import type {SceneConfig} from './types';

// Default demo scenes — these get overridden by the JSON config at render time
const defaultScenes: SceneConfig[] = [
  {
    type: 'intro',
    duration: 90, // 3 seconds at 30fps
    props: {
      hook: 'Stop scrolling.',
      subtitle: 'This changes everything',
    },
  },
  {
    type: 'kinetic-text',
    duration: 120,
    props: {
      lines: ['AI automation', 'saves businesses', '20+ hours per week'],
      accentLineIndex: 2,
      animation: 'slide-up',
    },
  },
  {
    type: 'stat-card',
    duration: 150,
    props: {
      title: 'The Numbers',
      stats: [
        {value: '85%', label: 'of tasks can be automated'},
        {value: '10x', label: 'faster than manual work'},
        {value: '$0', label: 'coding required'},
      ],
    },
  },
  {
    type: 'list-reveal',
    duration: 150,
    props: {
      title: 'What you can automate:',
      items: [
        'Customer support responses',
        'Social media posting',
        'Lead qualification',
        'Invoice processing',
        'Report generation',
      ],
      icon: '⚡',
    },
  },
  {
    type: 'quote-card',
    duration: 120,
    props: {
      quote: 'The best time to automate was yesterday. The second best time is now.',
      author: 'Every smart founder',
      role: 'in 2026',
    },
  },
  {
    type: 'cta',
    duration: 120,
    props: {
      headline: 'Ready to automate?',
      subtext: 'Start saving hours every week with AI-powered workflows',
      buttonText: 'Follow for more',
    },
  },
];

const totalDuration = defaultScenes.reduce((sum, s) => sum + s.duration, 0);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SocialVideo"
        component={VideoComposition}
        durationInFrames={totalDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scenes: defaultScenes,
          theme: THEMES.midnight,
        }}
      />
      {/* Quick preview compositions for each template */}
      <Composition
        id="KineticTextPreview"
        component={VideoComposition}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scenes: [defaultScenes[1]],
          theme: THEMES.ocean,
        }}
      />
      <Composition
        id="StatCardPreview"
        component={VideoComposition}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scenes: [defaultScenes[2]],
          theme: THEMES.sunset,
        }}
      />
      <Composition
        id="ListRevealPreview"
        component={VideoComposition}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scenes: [defaultScenes[3]],
          theme: THEMES.forest,
        }}
      />
    </>
  );
};
