import { HomeComponent } from './Components/home/home.component';
import { Routes } from '@angular/router';
import { HorarioComponent } from './Components/horario/horario.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'horario', component: HorarioComponent },
    { path: '**', redirectTo: '' }
];
