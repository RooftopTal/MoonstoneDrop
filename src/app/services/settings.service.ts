import { effect, Injectable, signal } from '@angular/core';

const STONE_COUNT_KEY = 'settings.stoneCount';
const SHOW_BETA_FEATURES_KEY = 'settings.showBetaFeatures';
const SHOW_DEPLOYMENT_ZONES_KEY = 'settings.showDeploymentZones';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  stoneCount = signal(this.load(STONE_COUNT_KEY, 7));
  maxDistance = signal(12);
  maxDepth = signal(4);
  showBetaFeatures = signal(this.loadBool(SHOW_BETA_FEATURES_KEY, false));
  showDeploymentZones = signal(this.loadBool(SHOW_DEPLOYMENT_ZONES_KEY, false));

  constructor() {
    effect(() => localStorage.setItem(STONE_COUNT_KEY, String(this.stoneCount())));
    effect(() => localStorage.setItem(SHOW_BETA_FEATURES_KEY, String(this.showBetaFeatures())));
    effect(() => localStorage.setItem(SHOW_DEPLOYMENT_ZONES_KEY, String(this.showDeploymentZones())));
  }

  private load(key: string, fallback: number): number {
    const stored = localStorage.getItem(key);
    return stored !== null ? Number(stored) : fallback;
  }

  private loadBool(key: string, fallback: boolean): boolean {
    const stored = localStorage.getItem(key);
    return stored !== null ? stored === 'true' : fallback;
  }
}
