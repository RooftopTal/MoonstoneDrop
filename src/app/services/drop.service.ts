import { Injectable } from '@angular/core';
import {Moonstone} from '../models/moonstone.model';

@Injectable({
  providedIn: 'root',
})
export class DropService {
  readonly maxDegrees = 360;
  readonly maxDistance = 12;
  readonly maxDepth = 4;

  dropAllStones = (stoneCount: number = 7): Moonstone[] =>
    Array.from({ length: stoneCount}, (_, index) => this.dropStone(index))

  dropStone = (index: number): Moonstone => ({
    id: index,
    degrees: Math.ceil(Math.random() * this.maxDegrees),
    distance: Math.ceil(Math.random() * this.maxDistance),
    depth: Math.ceil(Math.random() * this.maxDepth),
  })
}
