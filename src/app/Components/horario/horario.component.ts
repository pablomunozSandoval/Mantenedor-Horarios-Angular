import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { ICbo } from '../../models/cbo.model';
import { ToastrService } from 'ngx-toastr';
import { IHorarioSedePeriodo } from '../../models/horarioSedePeriodo.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../Dialogs/dialog-box/dialog-box.component';
import { HorarioUpdateResult } from '../../models/horarioUpdateResult.model';
import { MatButtonModule } from '@angular/material/button';
//tabla
import {MatSort, Sort, MatSortModule} from '@angular/material/sort'
import {LiveAnnouncer} from '@angular/cdk/a11y';

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
    MatInputModule,
    RouterModule,
    MatButtonModule,
    MatSortModule,
    MatSort,
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

  constructor(private backendService: BackendService, private _toastrNotify: ToastrService,private _dialog: MatDialog,private _liveAnnouncer: LiveAnnouncer) {
    this.sort = new MatSort();
   }
  @ViewChild(MatSort) sort: MatSort;


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
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  loadHorarios(codigoSede: number, codigoPeriodo: number): void {
    this.dataSource.data = [];
    console.log('estas aqui en load horarios')
    this.backendService.getHorariosSedePeriodo(codigoSede, codigoPeriodo, 0, 100, '0', 'asc', '')
      .subscribe(
        (data: IHorarioSedePeriodo[]) => {
          
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

  btnEditar(row: any): void { 
    this.openDialog(row);
  }
  
  openDialog(dataRow: any): void {
    console.log("datarow",dataRow)
    const dialogRef = this._dialog.open(DialogBoxComponent, {
      width: '750px',
      height: '320px',
      data: {
        i_hora_ccod: dataRow.hora_ccod,
        i_sede_ccod: this.sedeSelect.codigo,
        i_peri_ccod: this.periodoCodigo,
        i_hinicio: dataRow.hora_hinicio,
        i_htermino: dataRow.hora_htermino,
        i_turn_ccod: dataRow.turn_tdesc,  // Ajuste aquí según tu modelo
        i_audi_tusuario: dataRow.audi_tusuario,
        i_origen: 0  // Si no tienes este campo en los datos, lo puedes dejar como está
      },
      disableClose: true,
    });  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.backendService.updateHorario(result.i_hora_ccod, result.i_sede_ccod, result.i_peri_ccod, result.i_hinicio, result.i_htermino, result.i_turn_ccod, result.i_audi_tusuario, result.i_origen).subscribe(
          (res: HorarioUpdateResult[]) => {
            console.log('Resultado:', res);
            this._toastrNotify.success('Horario actualizado', 'Éxito');
            this.ngOnInit(); // Recargar los horarios después de la actualización
          },
          (error) => {
            console.error('Error:', error);
            this._toastrNotify.error(error.error, 'Error');
          }
        );
      }
    });
  }
  
}
