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
    this.supplierService.getProveedores().subscribe((response) => {
      this.suppliers = response;
      this.loading = false;
    });
  }

  search(event: any) {
    setTimeout(() => {
      this.searchString = event.target.value;
      if (this.searchString !== '') {
        this.supplierService
          .getProveedoresByName(this.searchString)
          .subscribe((res) => {
            this.suppliers = res;
            this.page = 1;
          });
      } else {
        this.supplierService.getProveedores().subscribe((res) => {
          this.suppliers = res;
          this.page = 1;
          this.loading = false;
        });
      }
    }, 500);
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }
}
