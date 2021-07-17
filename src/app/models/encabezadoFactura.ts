import { DetalleFactura } from './detalleFactura';
export class EncabezadoFactura {
  ENCFACPRO_NUMERO: string;
  COM_CODIGO: string;
  ENCFACPRO_FECHAEMISION: Date;
  ENCFACPRO_FECHAVENCIMIENTO: Date;
  ENCFACPRO_IVA: string;
  ENCFACPRO_ESTADO: string;
  PRO_CODIGO: string;
  ENCFACPRO_CONTACTO: string;
  ENCFACPRO_REFERENCIA: string;

  ENCFACPRO_BASEIVA: number; // subtotal 12%
  ENCFACPRO_BASECERO: number; // subtotal 0%
  ENCFACPRO_BASENOOBJIVA: number; // subtotal No Objeto iva
  ENCFACPRO_PORCEIVA: number; // subtotal exento iva
  ENCFACPRO_PORCEDES: number; // descuento
  ENCFACPRO_VALORICE: number; // valor ice

  // valor IRBPNR
  ENCFACPRO_VALORIVA: number; // iva 12%
  // propina
  ENCFACPRO_TOTAL: number; // valor total

  ENCFACPRO_BASEICE: number;
  ENCFACPRO_TOTALNETO: number;
  ENCFACPRO_VALORDES: number;

  ENCFACPRO_COMENTARIO: string;
  ENCFACPRO_OTROS: string;
  ASI_NRO: string;
  ENCFACPRO_FECHAREC: Date;
  ENCFACPRO_DISTCARGOS: string;
  ENCFACPRO_NUMDIASPLAZO: number;
  ENCFACPRO_IDCRETRI: string;
  ENCFACPRO_SERIE: string;
  ENCFACPRO_AUTORIZACION: string;
  ENCFACPRO_TIPCOM: string;
  ENCFACPRO_MONTIVAPRESER: string;
  ENCFACPRO_PORIVAPRESER: string;
  ENCFACPRO_MONTRETPRESER: string;
  ENCFACPRO_MONTIVATRABIE: string;
  ENCFACPRO_PORIVATRABIE: string;
  ENCFACPRO_MONTRETTRABIE: string;
  MAEMOTIVO_CODIGO: string;
  ENCFACPRO_FECHACADFAC: Date;
  ENCFACPRO_FLAG: string;
  ENCFACPRO_NUMINGRESO: string;
  ENCFACPRO_NUMLIQUIDACION: string;
  ENCFACPRO_FORMAPAGO: string;
  ENCFACPRO_TIPODES: string;
  USU_IDENTIFICACION: string;
  ENCFACPRO_GASTO: string;
  ENCORDCOM_NUMERO: string;
  ENCFACPRO_PAGOLOCALEXT: string;
  ENCFACPRO_PAISPAGO: string;
  ENCFACPRO_CONVDOBLETRIB: string;
  ENCFACPRO_PAGOEXTERIOR: string;
  ENCFACPRO_RETSERIEEST: string;
  ENCFACPRO_RETSERIEPTOEMI: string;
  ENCFACPRO_RETSECUENCIAL: string;
  ENCFACPRO_RETAUTORIZACION: string;
  ENCFACPRO_RETFECHA: Date;
  ENCFACPRO_ESTADO_FE: string;
  ENCFACPRO_AUTORIZACION_FE: string;
  ENCFACPRO_CLAVEACCESO_FE: string;
  ENCFACPRO_NOOBJETOIVA: string;
  ENCFACPRO_NUMRETENCION: string;
  ENCFACPRO_FECHAAUTRET_FE: Date;
  ENCFACPRO_LOCALIZACIONXML: string;
  ENCFACPRO_LOCALIZACIONPDF: string;
  ENCFACPRO_LOCALIZACIONXMLRET: string;
  ENCFACPRO_PATHXMLRET: string;
  COM_TIPOAMBFACTELEC: string;
  ENCFACPRO_PATHXMLNOAUTO_FE: string;
  ENCFACPRO_BLOQUEFACXML: string;
  ENCFACPRO_PATHPDF_FE: string;
  ENCFACPRO_PAGOREGFISCAL: string;
  ENCFACPRO_TIPOREGFISCAL: string;
  ENCFACPRO_CODPAISREGGEN: string;
  ENCFACPRO_CODPAISPARFIS: string;
  ENCFACPRO_DENOMINACION: string;
  ENCFACPRO_EMAIL: string;
  ENCFACPRO_CORREO: string;
  ENCFAC_XML: string;
  ENCFAC_WSMSG: string;
  ENCFACPRO_RUCTRANSPORTISTA: string;
  ENCFACPRO_RAZONTRANSPORTISTA: string;
  ENCFACPRO_REGIMENTRANSPOR: string;
  // array to invoice items
  itemsInvoice: DetalleFactura[] = [];

  constructor() {}
}
