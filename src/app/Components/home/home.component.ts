import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Select Module
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
// Toastr
import { ToastrService } from 'ngx-toastr';

// RouterLink
import { RouterModule, Router } from '@angular/router';
// Services
import { BackendService } from '../../services/backend.service';
import { ICbo } from '../../models/cbo.model';
import { HomeGuard } from '../../guards/home.guard';

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
  nuevoNombre: string = 'Laura';
  selected: string = '';
  lstSede: ICbo[] = [];
  periodoDescripcion: string = '';
  periodoCodigo: number | null = null;

  constructor(
    private backendService: BackendService,
    private _toastrNotify: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCboSedes(this.nuevoUsuario);
    this.getPeriodoActual();
    this.getCboOtrosPeriodos();
    this.guardarColaborador();
  }

  guardarColaborador() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('colaborador', this.nuevoNombre);
    }
  }

  obtenerPeriCCod(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.periodoDescripcion = localStorage.getItem('periodoActual') || '';
      const periodos = localStorage.getItem('periodos');
      console.log(periodos);
      if (this.periodoDescripcion && periodos) {
        try {
          const periodosArray: ICbo[] = JSON.parse(periodos);
          const periodoEncontrado = periodosArray.find(periodo => periodo.descripcion === this.periodoDescripcion);
          
          if (periodoEncontrado) {
            this.periodoCodigo = periodoEncontrado.codigo;
            localStorage.setItem('periodoCodigo', this.periodoCodigo.toString());
          } else {
            this._toastrNotify.warning('No se encontró el período actual en la lista de períodos', 'Advertencia');
            this.periodoCodigo = null;
          }
        } catch (error) {
          console.error('Error parsing periodos from localStorage', error);
          this._toastrNotify.error('Error al procesar los períodos almacenados', 'Error');
          this.periodoCodigo = null;
        }
      }
    }
  }

  getCboOtrosPeriodos() {
    this.backendService.getCboOtrosPeriodos().subscribe(
      (data: ICbo[]) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('periodos', JSON.stringify(data));
        }
      },
      (error: any) => {
        this._toastrNotify.error(error.error, 'Error al cargar otros periodos');
      }
    );
  }

  getPeriodoActual(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.backendService.getCboPeriodoActual().subscribe(
        (data: any) => {
          const periodoDescripcion = data[0].Periodo;
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('periodoActual', periodoDescripcion);
          }
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
      localStorage.setItem('fromHome', 'true'); // Asegúrate de establecer fromHome antes de la navegación
      this._toastrNotify.success('Sede seleccionada correctamente', 'Éxito');
      console.log('fromHome set to true in localStorage');
      this.obtenerPeriCCod(); // Obtener y guardar el código del período
      this.router.navigate(['/horario']); // Navegar a la página de horarios
    } else {
      this._toastrNotify.warning('No se ha seleccionado ninguna sede', 'Advertencia');
    }
  }
  
}
