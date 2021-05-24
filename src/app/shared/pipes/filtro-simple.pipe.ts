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
      // console.log(item);
      for (const property in item) {
        // console.log(`${property}: ${item[property]}`);
        if (item[property]) {
          if (item[property].toString().toLocaleLowerCase().includes(texto)) {
            // console.log(item);
            resultado.push(item);
            break;
          }
        }
      }
    });

    return resultado;
  }

}
