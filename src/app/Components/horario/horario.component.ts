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
import { Toast, ToastrService } from 'ngx-toastr';

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
  periodoSelect: ICbo = { codigo: 0, descripcion: '' }
  periodoActual : string = '';
  sedeSelect: ICbo = { codigo: 0, descripcion: '' }
  navTabEvent: number = 0;
  selected = '';
  lstPeriodos: ICbo[] = [];
  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'HORA_CCOD',
    'HORA_HINICIO',
    'HORA_HTERMINO',
    'TURN_TDESC',
    'AUDI_TUSUARIO',
    'action'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private backendService: BackendService,    private _toastrNotify: ToastrService,) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const sedeSelected = localStorage.getItem('sedeSelected');
      this.periodoActual = localStorage.getItem('periodoActual') || '';
      console.log(this.periodoActual)
      this.sedeSelect.codigo = sedeSelected ? Number(sedeSelected) : 0;
      if (this.sedeSelect.codigo) {
        this.loadHorarios();
      }
      
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  
  loadHorarios(): void {
    this.dataSource.data = [];
    this.backendService.getHorariosSedePeriodo(this.sedeSelect.codigo, this.periodoSelect.codigo, 0, 100, '0', 'asc', '')
      .subscribe(
        (data: any[]) => {
          this.dataSource.data = data;
        },
        (error: any) => {
          this._toastrNotify.error(error.error, 'Error');
        }

      );
  }

  buscarSedeClick(): void {
    this.loadHorarios();
  }

  onTabChange(event: any): void {
    this.navTabEvent = event.index;
    // Lógica para cargar los datos correspondientes a la pestaña seleccionada
    this.loadHorarios(); // O cambia esta lógica según tu necesidad
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
