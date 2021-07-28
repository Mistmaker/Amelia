import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroSimple'
})
export class FiltroSimplePipe implements PipeTransform {

  transform(datos: any[], texto: string): any[] {
    if (texto === '') return datos;
    texto = texto.toLocaleLowerCase();
    // return datos.filter(dato => dato.includes(texto));

    let resultado: any[] = [];

    datos.forEach(item => {
      for (const property in item) {
        if (item[property]) {
          if (item[property].toString().toLocaleLowerCase().includes(texto)) {
            resultado.push(item);
            break;
          }
        }
      }
    });

    return resultado;
  }

}
