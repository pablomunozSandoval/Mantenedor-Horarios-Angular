import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, pipe, throwError } from 'rxjs';
import { ICbo } from '../models/cbo.model';
import { HorarioUpdateResult } from '../models/horarioUpdateResult.model';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private apiUrl = 'http://localhost:51322/'; // Reemplazar esta URL con la URL de tu backend
  private _getHorariosSedePeriodo = 'Horario/getHorarioSedePeriodo';
  constructor(private http: HttpClient) {}

  private _getSedes = 'Combobox/getCboSedes';

  private getUrl(endpoint: string): string {
    return this.apiUrl + endpoint;
  }

  getSedes(rut: string): Observable<ICbo[]> {
    const url = this.getUrl(this._getSedes);

    const body = { i_pers_nrut: rut };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<ICbo[]>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }

  getHorariosSedePeriodo(
    i_sede_ccod: number,
    i_periodo_ccod: number,
    i_inicio: number,
    i_limite: number,
    i_sort: string,
    i_dir: string,
    i_filtro: string
  ): Observable<any[]> {
    const url = this.getUrl(this._getHorariosSedePeriodo);

    console.log('URL:', url);

    const params = new HttpParams()
      .set('i_sede_ccod', i_sede_ccod.toString())
      .set('i_peri_ccod', i_periodo_ccod.toString())
      .set('i_inicio', i_inicio.toString())
      .set('i_limite', i_limite.toString())
      .set('i_sort', i_sort)
      .set('i_dir', i_dir)
      .set('i_filtro', i_filtro);

    return this.http.get<any[]>(url, { params }).pipe(
      map((data) =>
        data.map((item) => ({
          hora_ccod: item.hora_ccod,
          hora_hinicio: item.HORA_HINICIO,
          hora_htermino: item.HORA_HTERMINO,
          turn_tdesc: item.turn_tdesc,
          tipo_horario: item.tipo_horario,
          audi_tusuario: item.audi_tusuario,
        }))
      ),
      catchError(this.handleError)
    );
  }

  getComboTurno(): Observable<ICbo[]> {
    const url = this.getUrl('Combobox/getComboTurno');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {}; // Si necesitas enviar algún dato en el cuerpo de la solicitud, puedes añadirlo aquí

    return this.http.post<any[]>(url, body, { headers }).pipe(
      map((data) =>
        data.map((item) => ({
          codigo: item.turn_ccod,
          descripcion: item.turn_tdesc,
        }))
      ),
      catchError(this.handleError)
    );
  }

  getCboPeriodoActual(): Observable<any> {
    const url = this.getUrl('Combobox/getPeriodoActual');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .get<ICbo[]>(url, { headers })
      .pipe(catchError(this.handleError));
  }

  getCboOtrosPeriodos(): Observable<ICbo[]> {
    const url = this.getUrl('Combobox/getCboOtrosPeriodos');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .get<ICbo[]>(url, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error); // for demo purposes only
    return throwError('Something bad happened; please try again later.');
  }

  updateHorario(
    i_hora_ccod: number,
    i_sede_ccod: number,
    i_peri_ccod: number,
    i_hinicio: Date,
    i_htermino: Date,
    i_turn_ccod: number,
    i_audi_tusuario: string,
    i_origen: number
  ): Observable<HorarioUpdateResult[]> {
    const params = new HttpParams()
      .set('i_hora_ccod', i_hora_ccod.toString())
      .set('i_sede_ccod', i_sede_ccod.toString())
      .set('i_peri_ccod', i_peri_ccod.toString())
      .set('i_hinicio', i_hinicio.toString())
      .set('i_htermino', i_htermino.toString())
      .set('i_turn_ccod', i_turn_ccod.toString())
      .set('i_audi_tusuario', i_audi_tusuario)
      .set('i_origen', i_origen.toString());
    
    return this.http
      .get<any[]>(`${this.apiUrl}Horario/UpdateHorario`, { params })
      .pipe(catchError(this.handleError))
      
  }
}
