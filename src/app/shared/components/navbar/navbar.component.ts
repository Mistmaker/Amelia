import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { Empresa } from '../../../models/empresa.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  empresa = new Empresa();
  constructor(private empresaService: EmpresaService, private route: Router) { }

  ngOnInit(): void {
    this.empresaService.getDatos().subscribe(resp => {
      this.empresa = resp;
    });
  }

  hasRoute(ruta: string) {
    return !this.route.url.includes(ruta);
  }

}
