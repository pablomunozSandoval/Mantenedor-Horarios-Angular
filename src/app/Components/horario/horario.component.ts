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
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

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
  styleUrls: ['./horario.component.css'],
})
export class HorarioComponent implements OnInit, AfterViewInit {
  periodoSelect: ICbo = { codigo: 0, descripcion: '' };
  periDescrActual: string = '';
  periCodSelect: number = 0;
  sedeSelect: ICbo = { codigo: 0, descripcion: '' };
  navTabEvent: number = 0;
  lstPeriodos: ICbo[] = [];
  htmlPeriSelect: any;
  dataSource = new MatTableDataSource<IHorarioSedePeriodo>();

  displayedColumns: string[] = [
    'Hora_Ccod',
    'Hora_Hinicio',
    'Hora_Htermino',
    'Turn_Tdesc',
    'Audi_Tusuario',
    'action',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private backendService: BackendService,
    private _toastrNotify: ToastrService,
    private _dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    this.sort = new MatSort();
  }
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const codSedeSelect = Number(localStorage.getItem('sedeSelected'));
      this.sedeSelect.codigo = codSedeSelect;

      this.periDescrActual = localStorage.getItem('periodoActual') || '';
      const periCodActual = Number(localStorage.getItem('periodoCodigo'));

      this.periCodSelect = this.navTabEvent === 0 ? periCodActual : this.htmlPeriSelect;
      console.log (this.periCodSelect , this.sedeSelect.codigo);
     
      if (this.sedeSelect.codigo && this.periCodSelect) {
        this.loadHorarios(this.sedeSelect.codigo, this.periCodSelect);
      }
    }
    this.loadPeriodos(); 
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
    console.log('estas aqui en load horarios');
    this.backendService
      .getHorariosSedePeriodo(codigoSede, codigoPeriodo, 0, 100, '0', 'asc', '')
      .subscribe(
        (data: IHorarioSedePeriodo[]) => {
          this.dataSource.data = data;
        },
        (error: any) => {
          this._toastrNotify.error(error.error, 'Error');
        }
      );
  }

  loadPeriodos(): void {
    // Nuevo: carga los períodos
    this.backendService.getCboOtrosPeriodos().subscribe(
      (data: ICbo[]) => {
        this.lstPeriodos = data;
      },
      (error: any) => {
        this._toastrNotify.error(error.error, 'Error al cargar otros periodos');
      }
    );
  }

  onPeriodoChange(): void {
    // Nuevo: carga los horarios cuando cambia el período seleccionado
    if (this.htmlPeriSelect !== null) {
      this.loadHorarios(this.sedeSelect.codigo, this.htmlPeriSelect);
    }
  }

  onTabChange(event: any): void {
    this.navTabEvent = event.index;
  
    if (this.navTabEvent === 0) {
      console.log('navTabEvent', this.navTabEvent);
      // Cargar horarios para el período actual
      this.loadHorarios(this.sedeSelect.codigo, this.periCodSelect);
    } else if (this.navTabEvent === 1 && this.htmlPeriSelect !== null) {
      console.log (this.htmlPeriSelect)
      if (this.htmlPeriSelect !== undefined) {
        console.log('navTabEvent', this.navTabEvent);
        this.loadHorarios(this.sedeSelect.codigo, this.htmlPeriSelect);
      }
      
    }
  }

  applyFilter(event: any): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  btnInsertar(row: any): void {
    this.openDialog(row,1);
  }
  btnEditar(row: any): void {
    this.openDialog(row, 2);
  }
  btnEliminar(row: any): void {
    this.openDialog(row,3);
  }


  openDialog(dataRow: any, type: number): void {

    if(this.navTabEvent === 1) {
      this.periCodSelect = this.htmlPeriSelect ? this.htmlPeriSelect: this.periCodSelect;

    }
  
    const dialogRef = this._dialog.open(DialogBoxComponent, {
      width: '750px',
      height: '320px',
      data: {
        type_button: type,
        i_hora_ccod: dataRow.hora_ccod,
        i_sede_ccod: this.sedeSelect.codigo,
        i_peri_ccod: this.periCodSelect,
        i_hinicio: dataRow.hora_hinicio,  // Asegúrate de que estos son strings
        i_htermino: dataRow.hora_htermino, // Asegúrate de que estos son strings
        i_turn_ccod: dataRow.turn_tdesc,   // Ajuste aquí según tu modelo
        i_audi_tusuario: dataRow.audi_tusuario,
        i_origen: 1, // Si no tienes este campo en los datos, lo puedes dejar como está
      },
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("dialog result:", result);

        this.backendService
          .updateHorario(
            result.i_hora_ccod,
            result.i_sede_ccod,
            result.i_peri_ccod,
            result.i_hinicio,   
            result.i_htermino,  
            result.i_turn_ccod,
            result.i_audi_tusuario,
            result.i_origen
          )
          .subscribe(
            (res: HorarioUpdateResult[]) => {
              
              console.log('res', res[0].resultado)
              if (res[0].resultado === 'Se ha actualizado el registro correctamente.') {
              this._toastrNotify.success('Horario actualizado', 'Éxito');
            }else{
              this._toastrNotify.error(res[0].resultado, 'Error');
            }
            console.log('init')
              this.ngOnInit(); 
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
