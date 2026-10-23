// Curated from project READMEs and public websites on October 15, 2026.
// Links live beside the descriptions so updating this page requires no API token.
export interface Project {
  name: string;
  repository?: string;
  description: string;
  category: 'Apps' | 'Developer tools' | 'Games';
  technology: string;
  icon: 'repeat' | 'book' | 'terminal' | 'hand' | 'spark' | 'house' | 'sail' | 'keyboard' | 'car';
  url?: string;
  logo?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    name: 'Nimue',
    description: 'A trading research workspace for backtesting strategies, screening markets, and simulated trading.',
    category: 'Apps',
    technology: 'TypeScript · React',
    icon: 'spark',
    logo: '/logos/nimue.svg',
    url: 'https://nimue.quest',
  },
  {
    name: 'DouJiao',
    description: 'Track movies, books, and games in a personal library with AI-powered search.',
    category: 'Apps',
    technology: 'TypeScript · Next.js',
    icon: 'book',
    logo: '/logos/doujiao.svg',
    url: 'https://doujiao.cloud.run/',
  },
  {
    name: 'vatlas',
    description: 'Explore Greater Vancouver property assessments through maps, neighbourhood insights, and comparisons.',
    category: 'Apps',
    technology: 'TypeScript · React · MapLibre',
    icon: 'house',
    logo: '/logos/vatlas.svg',
    url: 'https://vatlas.cloud.run/',
  },
  {
    name: 'Simple Hotkeys',
    repository: 'simple-hotkeys',
    description: 'Keyboard shortcuts for Chrome and Safari: search selected text, pin tabs, and switch between tabs.',
    category: 'Apps',
    technology: 'TypeScript · WXT',
    icon: 'keyboard',
    logo: '/logos/simple-hotkeys.png',
  },
  {
    name: 'Road Test Sim',
    description: 'Practise driving on Vancouver streets in a browser-based 3D simulator.',
    category: 'Games',
    technology: 'TypeScript · React · Three.js',
    icon: 'car',
    url: 'https://inquisitive-llama-29e477.netlify.app/',
  },
  {
    name: 'Routinely',
    repository: 'routinely',
    description: 'A browser extension for tracking habits and daily routines.',
    category: 'Apps',
    technology: 'TypeScript · React',
    icon: 'repeat',
    logo: '/logos/routinely.svg',
    url: 'https://liuyang1520.github.io/routinely/',
    featured: true,
  },
  {
    name: 'Kotoba',
    repository: 'kotoba',
    description: 'Japanese vocabulary flashcards and quizzes with progress saved in your browser.',
    category: 'Apps',
    technology: 'TypeScript · React',
    icon: 'book',
    logo: '/logos/kotoba.svg',
    url: 'https://liuyang1520.github.io/kotoba/',
    featured: true,
  },
  {
    name: 'Sail',
    description: 'A real-time sailing simulation set on the real Earth.',
    category: 'Games',
    technology: 'Game · Website',
    icon: 'sail',
    logo: '/logos/sail.png',
    url: 'https://liuyang1520.github.io/sail-sim-site/',
  },
  {
    name: 'ma',
    repository: 'ma',
    description: 'A terminal Markdown reader with proportional type and a native Go rendering engine.',
    category: 'Developer tools',
    technology: 'Go',
    icon: 'terminal',
    featured: true,
  },
  {
    name: 'Gesture Control',
    repository: 'gesture-control',
    description: 'Control your Mac with hand gestures. Camera processing stays on your device.',
    category: 'Apps',
    technology: 'Swift · macOS',
    icon: 'hand',
    logo: '/logos/gesture-control.png',
  },
  {
    name: 'Jasmine Local',
    repository: 'jasmine',
    description: 'Turn application state into typed choices and scores using a local language model.',
    category: 'Developer tools',
    technology: 'Python · llama.cpp',
    icon: 'spark',
  },
];
