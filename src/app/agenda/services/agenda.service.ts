import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Entidad } from '../../models/entidades.model';
import { urlWs } from 'src/environments/environment';
import { AgendaActividad, AgendaActividadAdmin } from '../../models/agendaActividades.model';
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
  
  getAgendaActividadesAdministrador() {
    return this.http.get<AgendaActividadAdmin[]>(`${urlWs}/api/agendaActividad/administrador`);
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

  postAgendaActividad(actividad: any) {
    return this.http.post(`${urlWs}/api/agendaActividad`, actividad);
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
  
  generarAgendaMultiplesClientes(datos: any) {
    console.log(datos);
    return this.http.post(`${urlWs}/api/agendaActividad/tareas`, datos);
  }

  public getDocumentos(id: number) {
    return this.http.get(`${urlWs}/api/agendaActividad/documento/${id}`);
  }
  
  public getDocumento(id: number) {
    return this.http.get(`${urlWs}/api/agendaActividad/documento/id/${id}`);
  }
  
  public downloadDocumento(id: number) {
    return `${urlWs}/api/agendaActividad/documento/${id}/download`;
  }
  
  public deleteDocumento(id: number) {
    return this.http.delete(`${urlWs}/api/agendaActividad/documento/${id}`);
  }
  
  public upload(file: any, data: any) {
    const formData = new FormData();
    console.log(file.newName)
    formData.append("current", file, file.newName);
    formData.append("idAgenda", data.idAgenda);
    formData.append("idUsuario", data.idUsuario);
    formData.append("comentarioArchivo", data.comentarioArchivo);
    formData.append("fecha", this.getFechaActual());
    return this.http.post(`${urlWs}/api/agendaActividad/documento/`, formData);
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
