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
  periodoSelect: ICbo = { codigo: 0, descripcion: '' }
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
  @ViewChild(MatSort) sort: MatSort;
  constructor(private backendService: BackendService, private _dialog: MatDialog,private _liveAnnouncer: LiveAnnouncer) {
    this.sort = new MatSort();
   }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const sedeSelected = localStorage.getItem('sedeSelected');
      this.sedeSelect.codigo = sedeSelected ? Number(sedeSelected) : 0;
      if (this.sedeSelect.codigo) {
        this.loadHorarios();
      }
    }
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

  loadHorarios(): void {
    this.backendService.getHorariosBySede(this.sedeSelect.codigo, 0, 100, '0', 'asc', '')
      .subscribe(
        (data: any[]) => {
          this.dataSource.data = data;
        },
        error => {
          console.error('Error loading horarios', error);
        }
      );
  }

  buscarSedeClick(): void {
    this.loadHorarios();
  }

  onTabChange(event: any): void {
    this.navTabEvent = event.index;
    this.loadHorarios();
  }

  applyFilter(event: any): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  btnEditar(id: number): void {
    const row: any = this.dataSource.data.find((x) => x.Id === id);
    this.openDialog(row);
  }

  btnEliminar(data: any): void {
    this.openDialog(data);
  }

  openDialog(data?: any): void {
    const dialogRef = this._dialog.open(DialogBoxComponent, {
      width: '300px',
      data: data || { i_hora_ccod: 1, i_sede_ccod: 1, i_peri_ccod: 1, i_hinicio: new Date(), i_htermino: new Date(), i_turn_ccod: 1, i_audi_tusuario: 'usuario', i_origen: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.backendService.updateHorario(result.i_hora_ccod, result.i_sede_ccod, result.i_peri_ccod, result.i_hinicio, result.i_htermino, result.i_turn_ccod, result.i_audi_tusuario, result.i_origen).subscribe(
          (res: HorarioUpdateResult[]) => {
            console.log('Resultado:', res);
            this.loadHorarios(); // Recargar los horarios después de la actualización
          },
          (error) => {
            console.error('Error:', error);
          }
        );
      }
    });
  }
}
