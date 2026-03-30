import { Routes } from '@angular/router';
import {MoonstoneDropComponent} from './components/moonstone-drop/moonstone-drop.component';

export const routes: Routes = [
  {
    path: 'drop',
    component: MoonstoneDropComponent
  },
  {
    path: '**',
    redirectTo: '/drop'
  },
];
