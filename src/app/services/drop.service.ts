import { Injectable } from '@angular/core';
import {Moonstone} from '../models/moonstone.model';
import {MoonstoneDropComponent} from '../components/moonstone-drop/moonstone-drop.component';

@Injectable({
  providedIn: 'root',
})
export class DropService {
  readonly maxDegrees = 360;
  readonly maxDistance = 12;

  dropAllStones = (stoneCount: number = 7): Moonstone[] =>
    Array.from({ length: stoneCount}, () => this.dropStone())

  dropStone = (): Moonstone => ({
    degrees: Math.ceil(Math.random() * this.maxDegrees),
    distance: Math.ceil(Math.random() * this.maxDistance),
  })
}
