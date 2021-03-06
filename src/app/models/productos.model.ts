import { Precio } from './precios';
export class Producto {
  ART_CODIGO: string;
  ART_CODIGOAUXILIAR: string;
  GRU_CODIGO: string;
  ART_NOMBRE: string;
  ART_MARCA: string;
  ART_MODELO: string;
  ART_TRIBUTAIVA: string = 'N';
  ART_TRIBUTAICE: string;
  ART_OBSERVACION: string;
  ART_ACTIVO: string = '1';
  ART_FECHACREADO: string;

  ART_CUENTAINVENTARIO: string;
  ART_CUENTACOSTOVENTAS: string;
  ART_CUENTAVENTAS: string;
  ART_CODIGOBARRAS: string;

  COM_CODIGO: string;
  GRUP_CODIGO: string;
  ART_NOMBREC: string;
  GRUP_CODIGOP: string;
  ART_FECHAING: string;
  ART_LABORATORIO: string;
  ART_UBICACION: string;
  ART_MULTIUNIDAD: string;
  ART_UNIDADVENTA: string;
  ART_UNIDADCOSTEO: string;
  ART_CADUCA: string;
  ART_CODIGOALT1: string;
  ART_CODIGOALT2: string;
  ART_CODIGOALT3: string;
  ART_CODIGOALT4: string;
  ART_LARGO: number;
  ART_ALTURA: number;
  ART_ANCHO: number;
  ART_PESO: number;
  ART_COMPUESTO: string;
  ART_CANTMIN: number;
  ART_CANTMAX: number;
  CON_CODIGOACT: string;
  CON_CODIGOGAS: string;
  CON_CODIGOING: string;
  CON_CODIGOORD1: string;
  CON_CODIGOORD2: string;
  ART_CODIGOICE: string;
  ART_SERIE: string;
  ART_VOLUMEN: number;
  PRESENTACION_CODIGO: string;
  ART_FACTOR: number;
  ART_FLAG: number;
  ART_FORMAVTA: number;
  ART_DESCUENTO: number;
  ART_SERIALFLAG: string;
  ART_DIASGARANTIA: number;
  ART_VALORICE: number;
  ART_COSTOHISTORICO: number;
  CEN_CODIGO: string;
  CON_CODIGODSCTO: string;
  ART_TIPO: string;
  CON_CODIGOPRODPROC: string;
  ART_PRODUCTOPROD: string;
  CON_CODIGOING2: string;
  CON_CODIGODSCTO2: string;
  ART_COSTOPROMEDIO: number;
  ART_FECHAULTCOSTO: Date;
  CON_CODIGOMP: string;
  ART_ACTIVARSERIAL: string;
  ART_ACTIVARDIM: string;
  ART_ACTIVARNUMEROTEL: string;
  ART_UNIDADCOMPRA: string;
  ART_FORMSRIVTAS: string;
  ART_FORMSRICOM: string;
  ART_PORDISES1: number;
  ART_PORDISES2: number;
  ART_CAMPANIA: string;
  ART_CAMTIPO: string;
  ART_BASENOOBJIVA: string;
  ART_SUBSIDIO: number;
  ART_UNIPORCAJA: number;
  ART_CODSRIICE: string;
  ART_CANTIDAD: number;

  precios: Precio[];

  constructor() {
    this.GRU_CODIGO = '01';
    this.ART_ACTIVO = '1';
    this.precios = [];
  }
}
