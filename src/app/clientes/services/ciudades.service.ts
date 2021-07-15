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

  getAllProvincias() {
    return this.http.get<Ciudad[]>(`${this.ruta}/api/ciudades/provincias`);
  }

  getAllCantonesByProvincia(codProv: string) {
    return this.http.get<Ciudad[]>(
      `${this.ruta}/api/ciudades/provincias/${codProv}`
    );
  }

}
