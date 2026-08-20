import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  imports: [MatIconModule, MatButtonModule, MatSliderModule, MatSlideToggleModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  settings = inject(SettingsService);
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/drop']);
  }
}
