import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor() { }

  getFechaActual() {
    let date = new Date();
    let dia: string, mes: string, anio: number;

    dia = date.getDate().toString().length < 2 ? `0${date.getDate().toString()}` : date.getDate().toString();
    mes = (date.getMonth() + 1).toString();
    mes = mes.length < 2 ? `0${mes}` : mes;
    anio = date.getFullYear();

    return `${anio}-${mes}-${dia}`;
  }

  getFechaHoraActual() {
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
