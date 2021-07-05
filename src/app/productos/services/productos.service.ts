import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urlWs } from '../../../environments/environment.prod';
import { Producto } from '../../models/productos.model';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  ruta = urlWs;

  constructor(private http: HttpClient) {}

  getProductos() {
    return this.http.get<Producto[]>(`${this.ruta}/api/productos`);
  }

  getProducto(id: string) {
    return this.http.get<Producto>(`${this.ruta}/api/productos/${id}`);
  }

  getProductoByName(name: string) {
    return this.http.post<Producto[]>(`${this.ruta}/api/productos/nombre`, { name });
  }

  postProducto(producto: Producto) {
    return this.http.post(`${this.ruta}/api/productos`, producto);
  }

  putProducto(id: string, producto: Producto) {
    return this.http.put(`${this.ruta}/api/productos/${id}`, producto);
  }

  deleteProducto(id: string) {
    return this.http.delete(`${this.ruta}/api/productos/${id}`);
  }
}
