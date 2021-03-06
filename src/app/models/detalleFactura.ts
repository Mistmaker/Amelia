import { Precio } from './precios';
export class DetalleFactura {
  ENCFACPRO_NUMERO: string;
  COM_CODIGO: string;
  DETFACPRO_LINEA: number;
  DETFACPRO_TIPODET: string;
  BOD_CODIGO: string;
  DETFACPRO_CODIGO: string;
  DETFACPRO_DESCRIPCION: string;
  DETFACPRO_UNIDAD: string;
  DETFACPRO_CANTIDAD: number;
  DETFACPRO_ENTREGADO: number;
  DETFACPRO_COSTO: number;
  DETFACPRO_VALDES: number;
  DETFACPRO_PORDES: number;
  DETFACPRO_TOTAL: number;
  DETFACPRO_PORIVA: number;
  DETFACPRO_IVA: number;
  DETFACPRO_TRIBICE: string;
  DETFACPRO_ICE: number;
  DETFACPRO_PORCEICE: string;
  DETFACPRO_BASEIVA: string;
  DETFACPRO_BASEICE: string;
  DETFACPRO_BASECERO: string;
  ENCORDCOM_NUMERO: string;
  DETORDCOM_LINEA: number;
  ENCNOTREC_NUMERO: string;
  DETNOTREC_LINEA: number;
  DETFACPRO_TOTALINCP: string;
  DETFACPRO_PROMOCION: string;
  DETFACPRO_PORDES2: string;
  DETFACPRO_PORDES3: string;
  CEN_CODIGO: string;
  DETFACPRO_FACTOR: string;
  DETFACPRO_PRECIOFOB: string;
  DETFACPRO_ESQUEMADOC: string;
  DETFACPRO_TIPOSRI: string;
  DETFACPRO_PRECIOA: number;
  DETFACPRO_PRECIOB: number;
  DETFACPRO_PRECIOC: number;
  TRNSOLFAC_CODIGO: string;
  TRNSOLFAC_LINEA: number;
  ENCREQ_NUMERO: string;
  DETREQ_LINEA: number;
  ENCGRE_CODIGO: number;
  DETGRE_LINEA: number;
  DETFACPRO_BASENOOBJIVA: string;
  DETFACPRO_TRIBASENOOBJIVA: string;
  DETFACPRO_CODIGOALT: string;
  DETFACPRO_CAJAS: number;
  DETFACPRO_FRACCIONES: number;

  precios: Precio[] = [];
  tributaIva:string;

  constructor() {}
}
