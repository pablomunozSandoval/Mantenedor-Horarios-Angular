import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { HorarioComponent } from './Components/horario/horario.component';
import { HomeGuard } from './guards/home.guard'; // Asegúrate de importar el guard

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'horario', component: HorarioComponent, canActivate: [HomeGuard] },
  { path: '**', redirectTo: '' }
];