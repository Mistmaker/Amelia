import { Precio } from './precios';
export class Producto {
    ART_CODIGO: string;
    ART_CODIGOAUXILIAR: string;
    GRU_CODIGO: string;
    ART_NOMBRE: string;
    ART_MARCA: string;
    ART_MODELO: string;
    ART_TRIBUTAIVA: string;
    ART_TRIBUTAICE: string;
    ART_OBSERVACION: string;
    ART_ESTADO: string;
    precios: Precio[];

    constructor() {
        this.GRU_CODIGO = '01';
        this.ART_ESTADO = '1';
        this.precios = [];
    }
}