import { CuentaContableService } from './../../../clientes/services/cuentas-contables.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CuentaContable } from './../../../models/cuentasContables';

@Component({
  selector: 'app-cuentas-contables',
  templateUrl: './cuentas-contables.component.html',
  styleUrls: ['./cuentas-contables.component.css'],
})
export class CuentasContablesComponent implements OnInit {
  query = '';
  nombreAuxiliar: string = '';
  cuentaContable = new CuentaContable();
  cuentasList: CuentaContable[] = [];
  posCuenta: number;
  cuentaSelected = false;

  constructor(
    public dialogRef: MatDialogRef<CuentasContablesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any | null,
    private cuentasService: CuentaContableService
  ) {
    if (data.name) {
      let name = data.name.split('|| ')
      this.query = name[1];
    }
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectCuenta(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.dialogRef.close(this.cuentaContable);
  }

  onChangeCuentaSelected(position: number) {
    this.posCuenta = position;
    this.query =
      this.cuentasList[position].CON_CODIGO +
      ' || ' +
      this.cuentasList[position].CON_NOMBRE;

    this.nombreAuxiliar = this.query;

    this.cuentaSelected = true;
    this.cuentaContable = this.cuentasList[position];
  }

  searchCuenta(event: any) {
    this.cuentaSelected = false;
    this.posCuenta = -1;
    setTimeout(() => {
      this.cuentasService
        .getCuentasByNombreOrCodigo(this.query)
        .subscribe((res) => {
          this.cuentasList = res;
        });
    }, 500);
  }
}
