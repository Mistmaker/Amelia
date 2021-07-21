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

  getCiudadesByNombre(name: string) {
    return this.http.post<Ciudad[]>(`${this.ruta}/api/ciudades/nombre`, {
      name,
    });
  }

  getCiudad(codCiudad: string) {
    return this.http.get<Ciudad>(`${this.ruta}/api/ciudades/${codCiudad}`);
  }

  postCiudad(ciudad: Ciudad) {
    return this.http.post(`${this.ruta}/api/ciudades`, ciudad);
  }

  putCiudad(id: string, ciudad: Ciudad) {
    return this.http.put(`${this.ruta}/api/ciudades/${id}`, ciudad);
  }

  deleteCiudad(codCiudad: string) {
    return this.http.delete(`${this.ruta}/api/ciudades/${codCiudad}`);
  }
}
