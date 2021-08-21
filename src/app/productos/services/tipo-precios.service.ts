import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urlWs } from '../../../environments/environment';
import { TipoPrecio } from '../../models/tipoPrecios';

@Injectable({
  providedIn: 'root'
})
export class TipoPreciosService {

  ruta = urlWs;

  constructor(private http: HttpClient) { }

  getTiposPrecios(){
    return this.http.get<TipoPrecio[]>(`${this.ruta}/api/tipoPrecios`);
  }
}
