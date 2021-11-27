import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Empresa, EmpresaPlaca } from '../../models/empresa.model';
import { urlWs } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http: HttpClient) { }

  getDatos() {
    return this.http.get<Empresa>(`${urlWs}/api/empresa`);
  }
  setDatos(empresa: Empresa) {
    return this.http.put<Empresa>(`${urlWs}/api/empresa/${empresa.COMCODIGO}`, empresa);
  }

  getDatosPlacas(){
    return this.http.get<EmpresaPlaca[]>(`${urlWs}/api/empresaPlacas`);
  }
}
