import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {DropService} from '../../services/drop.service';
import {Moonstone} from '../../models/moonstone.model';
import { MatTableModule
} from '@angular/material/table';
import {MapComponent} from '../map/map.component';

@Component({
  selector: 'app-moonstone-drop',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MapComponent,
  ],
  templateUrl: './moonstone-drop.component.html',
  styleUrl: './moonstone-drop.component.css',
})
export class MoonstoneDropComponent {
  private dropService = inject(DropService);
  private cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  readonly columnsToDisplay: string[] = ['degrees', 'distance', 'reroll'];

  stones: Moonstone[] = [];

  mulliganAll() {
    this.stones = this.dropService.dropAllStones();
  }

  rerollStone(index: number) {
    if (!this.stones || !this.stones[index]) {
      console.error(`Could not drop stone ${index}`);
      return;
    }
    this.stones[index] = this.dropService.dropStone();
    this.stones = [...this.stones];
  }
}
