import { effect, Injectable, signal } from '@angular/core';

const STONE_COUNT_KEY = 'settings.stoneCount';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  stoneCount = signal(this.load(STONE_COUNT_KEY, 7));
  maxDistance = signal(12);
  maxDepth = signal(4);

  constructor() {
    effect(() => localStorage.setItem(STONE_COUNT_KEY, String(this.stoneCount())));
  }

  private load(key: string, fallback: number): number {
    const stored = localStorage.getItem(key);
    return stored !== null ? Number(stored) : fallback;
  }
}
