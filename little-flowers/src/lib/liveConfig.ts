'use client';

import { useSyncExternalStore } from 'react';
import type { LittleFlowersCustomizationConfig } from '@/types';

type Listener = () => void;

let config: LittleFlowersCustomizationConfig = {};
const listeners = new Set<Listener>();

export function getLiveConfig(): LittleFlowersCustomizationConfig {
  return config;
}

const EMPTY_CONFIG: LittleFlowersCustomizationConfig = Object.freeze({});

// Server snapshot MUST be empty so per-request state never leaks between tenants.
// Must return a cached reference to avoid infinite loops in useSyncExternalStore.
export function getServerLiveConfig(): LittleFlowersCustomizationConfig {
  return EMPTY_CONFIG;
}

export function setLiveConfig(next: Partial<LittleFlowersCustomizationConfig>): void {
  config = { ...config, ...next };
  listeners.forEach((l) => l());
}

export function subscribeLiveConfig(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useStorioConfigLive(): LittleFlowersCustomizationConfig {
  return useSyncExternalStore(subscribeLiveConfig, getLiveConfig, getServerLiveConfig);
}
