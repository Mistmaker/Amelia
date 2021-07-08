import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlWs } from 'src/environments/environment.prod';
import { Ciudad } from './../../models/ciudades.models';

@Injectable({
  providedIn: 'root',
})
export class CiudadesService {
  ruta = urlWs;
  constructor(private http: HttpClient) {}

  getAllCiudades() {
    return this.http.get<Ciudad[]>(`${this.ruta}/api/ciudades`);
  }
}
