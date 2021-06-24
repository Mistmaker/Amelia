import { ProveedoresService } from './../../services/proveedores.service';
import { Component, OnInit } from '@angular/core';
import { Proveedor } from './../../../models/proveedores.model';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
})
export class ProveedoresComponent implements OnInit {
  suppliers: Proveedor[] = [];
  loading = false;
  searchString = '';

  // Para paginación
  page = 1;
  count = 0;
  tableSize = 7;
  tableSizes = [3, 6, 9, 12];

  constructor(private supplierService: ProveedoresService) {}

  ngOnInit(): void {
    this.loading = true;
    console.log('on init - proveedores');

    this.supplierService.getProveedores().subscribe((response) => {
      this.suppliers = response;
      console.log('data', response);
      this.loading = false;
    });
  }
}
