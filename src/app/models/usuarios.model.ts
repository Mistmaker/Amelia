export class Usuario {

  USUIDENTIFICACION: string;
  USUCLAVE: string;
  USURUCI: string;
  USUAPELLIDO: string;
  USUNOMBRE: string;
  COMCODIGO: string;
  USUPERFIL: string;
  USUFECHAINICIO: Date;
  USUFECHAFINAL: Date;
  BOD_CODIGO: string;
  BOD_CODIGO_DEV: string;
  PERFIL_CODIGO: string;
  VEN_CODIGO: string;

  constructor() {
    this.COMCODIGO = '01';
    this.USURUCI = '';
    this.USUAPELLIDO = '';
    this.USUNOMBRE = '';
  }
}
