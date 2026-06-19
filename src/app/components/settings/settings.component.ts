import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  imports: [MatIconModule, MatButtonModule, MatSliderModule],
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
