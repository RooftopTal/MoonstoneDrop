import { Injectable } from '@angular/core';
import {Moonstone} from '../models/moonstone.model';

@Injectable({
  providedIn: 'root',
})
export class ColourService {
  static readonly rainbow = [
    '#a35',
    '#e94',
    '#ed0',
    '#9d5',
    '#0bc',
    '#36b',
    '#817'
  ];

  getColour = (index: number) => ColourService.rainbow[index];
}
