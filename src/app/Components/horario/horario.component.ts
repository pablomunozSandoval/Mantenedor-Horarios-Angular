import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';  // Asegúrate de tener esto
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { BackendService } from '../../services/backend.service';
import { ICbo } from '../../models/cbo.model';
import { ToastrService } from 'ngx-toastr';
import { IHorarioSedePeriodo } from '../../models/horarioSedePeriodo.model';

@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,  // Asegúrate de tener esto
    RouterModule // Asegúrate de tener esto
  ],
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent implements OnInit, AfterViewInit {
  periodoSelect: ICbo = { codigo: 0, descripcion: '' };
  periodoDescripcion: string = '';
  periodoCodigo: number = 0;
  sedeSelect: ICbo = { codigo: 0, descripcion: '' };
  navTabEvent: number = 0;
  selected = '';
  lstPeriodos: ICbo[] = [];
  selectedPeriodo: number | null = null; // Nuevo: almacena el período seleccionado
  dataSource = new MatTableDataSource<IHorarioSedePeriodo>();

  displayedColumns: string[] = [
    'Hora_Ccod',
    'Hora_Hinicio',
    'Hora_Htermino',
    'Turn_Tdesc',
    'Audi_Tusuario',
    'action'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private backendService: BackendService, private _toastrNotify: ToastrService) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const sedeSelected = localStorage.getItem('sedeSelected');
      this.periodoDescripcion = localStorage.getItem('periodoActual') || '';
      const periodoCodigo = localStorage.getItem('periodoCodigo');
      this.sedeSelect.codigo = sedeSelected ? Number(sedeSelected) : 0;
      this.periodoCodigo = periodoCodigo ? Number(periodoCodigo) : 0;

      if (this.sedeSelect.codigo && this.periodoCodigo) {
        this.loadHorarios(this.sedeSelect.codigo, this.periodoCodigo);
      }
    }
    this.loadPeriodos(); // Nuevo: carga los períodos
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadHorarios(codigoSede: number, codigoPeriodo: number): void {
    this.dataSource.data = [];
    console.log('estas aqui en load horarios')
    this.backendService.getHorariosSedePeriodo(codigoSede, codigoPeriodo, 0, 100, '0', 'asc', '')
      .subscribe(
        (data: any[]) => {
          console.log(data)
          this.dataSource.data = data;
        },
        (error: any) => {
          this._toastrNotify.error(error.error, 'Error');
        }
      );
  }

  loadPeriodos(): void { // Nuevo: carga los períodos
    this.backendService.getCboOtrosPeriodos().subscribe(
      (data: ICbo[]) => {
        this.lstPeriodos = data;
      },
      (error: any) => {
        this._toastrNotify.error(error.error, 'Error al cargar otros periodos');
      }
    );
  }

  onPeriodoChange(): void { // Nuevo: carga los horarios cuando cambia el período seleccionado
    if (this.selectedPeriodo !== null) {
      this.loadHorarios(this.sedeSelect.codigo, this.selectedPeriodo);
    }
  }

  onTabChange(event: any): void { // Implementación del método onTabChange
    this.navTabEvent = event.index;
    if (this.navTabEvent === 0) {
      // Cargar horarios para el período actual
      this.loadHorarios(this.sedeSelect.codigo, this.periodoCodigo);
    } else if (this.navTabEvent === 1 && this.selectedPeriodo !== null) {
      // Cargar horarios para el período seleccionado en "Otros Periodos"
      this.loadHorarios(this.sedeSelect.codigo, this.selectedPeriodo);
    }
  }

  applyFilter(event: any): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  btnEditar(id: number): void {
    // Implementación de la función de edición
  }

  btnEliminar(row: any): void {
    // Implementación de la función de eliminación
  }
}
