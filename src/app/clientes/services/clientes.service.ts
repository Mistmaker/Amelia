import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  urlWs,
  urlWsRuc,
  urlWsRucAlterno,
  urlWsCedula,
  urlWsRucCM,
  urlWsRucCE,
  urlWsRucEF,
  urlWsRucAR,
} from '../../../environments/environment.prod';
import { Cliente } from '../../models/clientes.model';
import { ClienteDocumentos } from '../../models/clientesDocumentos';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  ruta = urlWs;
  wsSri = urlWsRuc;
  wsSriAlt = urlWsRucAlterno;
  wsCedula = urlWsCedula;

  constructor(private http: HttpClient) {}

  getClientes() {
    return this.http.get<Cliente[]>(`${this.ruta}/api/clientes`);
  }

  getCliente(id: string) {
    return this.http.get<Cliente>(`${this.ruta}/api/clientes/${id}`);
  }

  postCliente(cliente: Cliente) {
    return this.http.post(`${this.ruta}/api/clientes`, cliente);
  }

  putCliente(id: string, cliente: Cliente) {
    return this.http.put(`${this.ruta}/api/clientes/${id}`, cliente);
  }

  deleteCliente(id: string) {
    return this.http.delete(`${this.ruta}/api/clientes/${id}`);
  }

  getDatosAdicionales(datos: any){
    return this.http.post(`${this.ruta}/api/cliDatAdi/ruc`, datos);
  }

  getClienteSri(ruc: string) {
    return this.http.get(`${this.wsSri}${ruc}`);
  }

  getClienteSriAlt(ruc: string) {
    return this.http.get(`${this.wsSriAlt}${ruc}`);
  }

  getClienteCedula(cedula: string) {
    return this.http.get(`${this.wsCedula}${cedula}`);
  }

  getClientesPorNombre(nombre: string) {
    return this.http.post<Cliente[]>(`${this.ruta}/api/clientes/nombre`, {
      nombre,
    });
  }
  getClientesPorVence(vence: string) {
    return this.http.post<Cliente[]>(`${this.ruta}/api/clientes/vence`, {vence});
  }
  getClientesPorGrupo(gruCodigo: string) {
    return this.http.post<Cliente[]>(`${this.ruta}/api/clientes/grupo`, {gruCodigo});
  }

  getIsMicro(id: string) {
    return this.http.get(`${urlWsRucCM}${id}`);
  }

  getIsContribuyenteEspecial(id: string) {
    return this.http.get(`${urlWsRucCE}${id}`);
  }

  getIsEmpresaFantasma(id: string) {
    return this.http.get(`${urlWsRucEF}${id}`);
  }

  getIsAgenteRentencion(id: string) {
    return this.http.get(`${urlWsRucAR}${id}`);
  }

  getDocumentos(id: string){
    return this.http.get<ClienteDocumentos[]>(`${this.ruta}/api/cliDocs/cliente/${id}`);
  }
}
