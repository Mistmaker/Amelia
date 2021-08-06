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

  constructor(private http: HttpClient) { }

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

  getDatosAdicionales(datos: any) {
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
    return this.http.post<Cliente[]>(`${this.ruta}/api/clientes/vence`, { vence });
  }
  getClientesPorGrupo(gruCodigo: string) {
    return this.http.post<Cliente[]>(`${this.ruta}/api/clientes/grupo`, { gruCodigo });
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

  public upload(file: any, cli: Cliente) {
    const formData = new FormData();
    formData.append("current", file);
    formData.append("idCli", cli.CLI_CODIGO);
    return this.http.post(`${this.ruta}/api/cliDocs/`, formData);
  }
  public upload2(file: any[], cli: Cliente, total: any = null, estado: any = null, acc = 'd') {
    const formData = new FormData();
    for (const f of file) {
      console.log(f);
      formData.append("current", f, f.newName);
    }
    formData.append("idCli", cli.CLI_CODIGO);
    formData.append("fecha", this.getFechaActual());
    formData.append("total", total);
    formData.append("estado", estado);
    if (acc === 'd'){
      return this.http.post(`${this.ruta}/api/cliDocs/`, formData);
    } else if (acc === 'i'){
      return this.http.post(`${this.ruta}/api/cliDocs/img/`, formData);
    }
  }

  public downloadUrl(file: any) {
    return `${this.ruta}/api/cliDocs/${file.DOC_CODIGO}/download`;
  }

  getDocumentos(id: string) {
    return this.http.get<ClienteDocumentos[]>(`${this.ruta}/api/cliDocs/cliente/${id}`);
  }
  getImagenes(id: string) {
    return this.http.get<ClienteDocumentos[]>(`${this.ruta}/api/cliDocs/cliente/img/${id}`);
  }

  deleteDocumento(id: string) {
    return this.http.delete(`${this.ruta}/api/cliDocs/${id}`);
  }

  getFechaActual() {
    let date = new Date();
    let dia: string, mes: string, anio: number;

    dia = date.getDate().toString().length < 2 ? `0${date.getDate().toString()}` : date.getDate().toString();
    mes = date.getMonth().toString().length < 2 ? `0${date.getMonth().toString()}` : date.getMonth().toString();
    anio = date.getFullYear();

    return `${anio}-${mes}-${dia}`;
  }
}
