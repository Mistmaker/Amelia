import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Entidad } from '../../models/entidades.model';
import { urlWs } from 'src/environments/environment';
import { AgendaActividad } from '../../models/agendaActividades.model';
import { ComentarioAgenda } from '../../models/comentariosAgenda.model';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private http: HttpClient) { }

  getEntidades() {
    return this.http.get<Entidad[]>(`${urlWs}/api/entidades`);
  }

  getAgendaActividades() {
    return this.http.get<AgendaActividad[]>(`${urlWs}/api/agendaActividad`);
  }

  getActividadesGeneradas() {
    return this.http.get<AgendaActividad[]>(`${urlWs}/api/agendaActividad/actividades`);
  }

  getActividadesGeneradasCliente(id: string) {
    return this.http.get<AgendaActividad[]>(`${urlWs}/api/agendaActividad/actividadesCliente/${id}`);
  }

  getEstadoActividades() {
    return this.http.get(`${urlWs}/api/agendaActividad/estadoActividades`);
  }

  putAgendaActividad(actividad: AgendaActividad) {
    return this.http.put(`${urlWs}/api/agendaActividad/${actividad.id}`, actividad);
  }

  deleteAgendaActividad(id: string) {
    return this.http.delete(`${urlWs}/api/agendaActividad/${id}`);
  }

  getComentariosAgendaActividad(idActividad: string) {
    return this.http.get<ComentarioAgenda[]>(`${urlWs}/api/comentariosAgenda/acti/${idActividad}`);
  }

  setComentarioAgendaActividad(comentario: ComentarioAgenda) {
    return this.http.post(`${urlWs}/api/comentariosAgenda`, comentario);
  }

  putComentarioAgendaActividad(comentario: ComentarioAgenda) {
    return this.http.put(`${urlWs}/api/comentariosAgenda/${comentario.id}`, comentario);
  }

  deleteComentarioAgendaActividad(id: string) {
    return this.http.delete(`${urlWs}/api/comentariosAgenda/${id}`);
  }

  deleteActividadesGeneradasCliente(id: string, datos: any) {
    return this.http.post(`${urlWs}/api/agendaActividad/actividadesCliente/${id}`, datos);
  }

  generarAgenda(datos) {
    return this.http.post(`${urlWs}/api/agendaActividad/periodo`, datos);
  }

  getFechaActual() {
    let date = new Date();
    let dia: string, mes: string, anio: number, hora: number, min: number, seg: number;

    dia = date.getDate().toString().length < 2 ? `0${date.getDate().toString()}` : date.getDate().toString();
    mes = (date.getMonth() + 1).toString();
    mes = mes.length < 2 ? `0${mes}` : mes;
    anio = date.getFullYear();

    hora = date.getHours();
    min = date.getMinutes();
    seg = date.getSeconds();

    return `${anio}-${mes}-${dia} ${hora}:${min}:${seg}`;
  }

}
