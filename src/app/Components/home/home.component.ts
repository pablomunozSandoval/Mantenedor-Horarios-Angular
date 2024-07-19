import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

//Material Select Module
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
//Toastr
import { ToastrService } from 'ngx-toastr';

//RouterLink
import { RouterModule, Router } from '@angular/router';
//Services
import { BackendService } from '../../services/backend.service';
import { ICbo } from '../../models/cbo.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  nuevoUsuario: string = '17190472';
  selected: string = '';
  lstSede: ICbo[] = [];

  constructor(
    private backendService: BackendService,
    private _toastrNotify: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._toastrNotify.warning('Cargando datos...', 'Cargando');
    this.getCboSedes(this.nuevoUsuario);
    this.getCboPeriodoActual();
    this.getCboPeriodos();
  }
  getCboPeriodos() {
    
  }
  getCboPeriodoActual(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.backendService.getCboPeriodoActual().subscribe(
        (data: any) => {
            const periodoActual = data[0].Periodo;
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.setItem('periodoActual', periodoActual);
            }
            this._toastrNotify.success('Se cargaron los datos del periodo actual', 'Éxito');
            resolve();
        },
        (error: any) => {
          this._toastrNotify.error(error.error, 'Error');
          reject(error);
        }
      );
    });
  }

  getCboSedes(rut: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.backendService.getSedes(rut).subscribe(
        (data: ICbo[]) => {
          this.lstSede = data;
          this._toastrNotify.success('Se cargaron los datos de las sedes', 'Éxito');
          resolve();
        },
        (error: any) => {
          this._toastrNotify.error(error.error, 'Error');
          reject(error);
        }
      );
    });
  }

  onClickBtn() {
    const sedeSelected = this.selected;
    if (sedeSelected) {
      localStorage.setItem('sedeSelected', sedeSelected);
      this._toastrNotify.success('Sede seleccionada guardada', 'Éxito');
      this.router.navigate(['/horario']); // Navegar a la página de horarios
    } else {
      this._toastrNotify.warning(
        'No se ha seleccionado ninguna sede',
        'Advertencia'
      );
    }
  }
}
