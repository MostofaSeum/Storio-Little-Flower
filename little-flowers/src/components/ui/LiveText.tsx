'use client';

import { useSyncExternalStore } from 'react';
import {
  getLiveConfig,
  getServerLiveConfig,
  subscribeLiveConfig,
} from '@/lib/liveConfig';
import type { LittleFlowersCustomizationConfig } from '@/types';

type Field = (keyof LittleFlowersCustomizationConfig & string) | (string & {});

interface LiveTextProps {
  field: Field;
  initial?: string | null;
  fallback?: string;
}

/**
 * Renders a configurable text field.
 * - Server render: uses `initial` (from the server-fetched customization prop).
 * - Client: uses the live config from `THEME_UPDATE` if present, else `initial`.
 */
export default function LiveText({ field, initial, fallback = '' }: LiveTextProps) {
  const live = useSyncExternalStore(
    subscribeLiveConfig,
    getLiveConfig,
    getServerLiveConfig
  ) as Record<string, unknown>;

  const liveValue = live?.[field];
  const value =
    typeof liveValue === 'string' && liveValue.trim() !== ''
      ? liveValue
      : (initial !== undefined && initial !== null && initial !== '' ? initial : fallback);

  return <>{value}</>;
}
