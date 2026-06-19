import { Injectable, inject } from '@angular/core';
import {Moonstone} from '../models/moonstone.model';
import {SettingsService} from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class DropService {
  private settings = inject(SettingsService);
  readonly maxDegrees = 360;

  dropAllStones = (): Moonstone[] =>
    Array.from({ length: this.settings.stoneCount() }, (_, index) => this.dropStone(index))

  dropStone = (index: number): Moonstone => ({
    id: index,
    degrees: Math.ceil(Math.random() * this.maxDegrees),
    distance: Math.ceil(Math.random() * this.settings.maxDistance()),
    depth: Math.ceil(Math.random() * this.settings.maxDepth()),
  })
}
