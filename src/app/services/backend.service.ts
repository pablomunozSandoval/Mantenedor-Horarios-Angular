import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ICbo } from '../models/cbo.model';
import { IHorarioSede } from '../models/horarioSede.model';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = 'http://localhost:51322/';  // Reemplazar esta URL con la URL de tu backend
  private _getHorariosBySede = 'Horario/getHorariosBySede';
  constructor(private http: HttpClient) { }


  private _getSedes = 'Combobox/getCboSedes';

  private getUrl(endpoint: string): string {
    return this.apiUrl+ endpoint;
  }

  getSedes(rut: string): Observable<ICbo[]> {
    const url = this.getUrl(this._getSedes);
    
    const body = { i_pers_nrut: rut };
    console.log(url, body);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<ICbo[]>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }

  getHorariosBySede(i_sede_ccod: number, i_inicio: number, i_limite: number, i_sort: string, i_dir: string, i_filtro: string): Observable<IHorarioSede[]> {
    const url = this.getUrl(this._getHorariosBySede);
    
    const params = new HttpParams()
      .set('i_sede_ccod', i_sede_ccod.toString())
      .set('i_inicio', i_inicio.toString())
      .set('i_limite', i_limite.toString())
      .set('i_sort', i_sort)
      .set('i_dir', i_dir)
      .set('i_filtro', i_filtro);

    return this.http.get<IHorarioSede[]>(url, { params })
      .pipe(catchError(this.handleError));
  }

  getCboOtrosPeriodos(): Observable<ICbo[]> {
    const url = this.getUrl('Horario/getCboOtrosPeriodos');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<ICbo[]>(url, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error); // for demo purposes only
    return throwError('Something bad happened; please try again later.');
  }

  // Puedes agregar más métodos aquí para diferentes endpoints
}
