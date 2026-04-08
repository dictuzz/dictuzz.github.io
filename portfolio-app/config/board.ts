import type { BoardNavigatorItem } from '@/components/ui/case-navigator';
import type { BoardAnchor } from '@/components/ui/red-string';

// Board dimension configs
export const BOARD_CONFIG = {
  CANVAS_WIDTH: 5000,
  CANVAS_HEIGHT: 3000,
  DESKTOP_CARD_WIDTH: 880,
  DESKTOP_CARD_HEIGHT: 840,
  DESKTOP_FOCUS_X_RATIO: 0.5,
  DESKTOP_FOCUS_Y_RATIO: 0.6
} as const;

// Static Nodes
export const INTRO_NODE = {
  id: 'intro',
  boardX: 180,
  boardY: 260,
  title: 'Subject Dossier',
  href: undefined
} satisfies BoardAnchor & BoardNavigatorItem;

export const CONTACT_NODE = {
  id: 'contact',
  boardX: 3600,
  boardY: 1820,
  title: 'Dispatch Contact',
  href: '#dispatch'
} satisfies BoardAnchor & BoardNavigatorItem;
