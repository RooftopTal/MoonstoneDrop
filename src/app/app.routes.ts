import { Routes } from '@angular/router';
import {MoonstoneDropComponent} from './components/moonstone-drop/moonstone-drop.component';
import {SettingsComponent} from './components/settings/settings.component';

export const routes: Routes = [
  {
    path: 'drop',
    component: MoonstoneDropComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: '**',
    redirectTo: '/drop'
  },
];
