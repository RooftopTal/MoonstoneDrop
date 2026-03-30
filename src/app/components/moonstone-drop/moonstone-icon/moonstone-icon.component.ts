import {ChangeDetectorRef, Component, inject, Input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-moonstone-icon',
  imports: [
    MatIconModule,
  ],
  template: '<mat-icon [style.color]="this.colour">add_circle</mat-icon>',
  styleUrl: './moonstone-icon.component.css',
})
export class MoonstoneIconComponent {
  @Input() colour?: string = undefined;
}
