import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actividades } from '../../models/actividades.model';
import { urlWs } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {

  constructor(private http: HttpClient) { }

  getActividades() {
    return this.http.get<Actividades[]>(`${urlWs}/api/actividades`);
  }

  getActividad(id: string) {
    return this.http.get<Actividades>(`${urlWs}/api/actividades/${id}`);
  }

  postActividad(actividad: Actividades) {
    return this.http.post(`${urlWs}/api/actividades`, actividad);
  }

  putActividad(actividad: Actividades) {
    return this.http.put(`${urlWs}/api/actividades/${actividad.id_actividad}`, actividad);
  }

  deleteActividad(id: number) {
    return this.http.delete(`${urlWs}/api/actividades/${id}`);
  }
}
