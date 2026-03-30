import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {DropService} from '../../services/drop.service';
import {Moonstone} from '../../models/moonstone.model';
import { MatTableModule
} from '@angular/material/table';
import {MapComponent} from '../map/map.component';
import {ColourService} from '../../services/colour.service';
import {MoonstoneIconComponent} from './moonstone-icon/moonstone-icon.component';

@Component({
  selector: 'app-moonstone-drop',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MapComponent,
    MoonstoneIconComponent,
  ],
  templateUrl: './moonstone-drop.component.html',
  styleUrl: './moonstone-drop.component.css',
})
export class MoonstoneDropComponent {
  private dropService = inject(DropService);
  colourService = inject(ColourService);

  readonly columnsToDisplay: string[] = ['colour', 'degrees', 'distance', 'depth', 'reroll'];

  stones: Moonstone[] = [];

  mulliganAll() {
    this.stones = this.dropService.dropAllStones();
  }

  rerollStone(index: number) {
    if (!this.stones || !this.stones[index]) {
      console.error(`Could not drop stone ${index}`);
      return;
    }
    this.stones[index] = this.dropService.dropStone(index);
    this.stones = [...this.stones];
  }

  getColour = (stone: Moonstone) => this.colourService.getColour(stone.id)
}
