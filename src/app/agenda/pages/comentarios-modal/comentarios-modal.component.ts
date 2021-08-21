import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgendaService } from '../../services/agenda.service';
import { ComentarioAgenda } from '../../../models/comentariosAgenda.model';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-comentarios-modal',
  templateUrl: './comentarios-modal.component.html',
  styleUrls: ['./comentarios-modal.component.css']
})
export class ComentariosModalComponent implements OnInit {

  cantComentarios = 0;
  comentarios: ComentarioAgenda[] = [];
  comentario = new ComentarioAgenda();
  usuario = '';

  textoBusqueda = '';
  constructor(private agendaService: AgendaService, private authService: AuthService, public dialogRef: MatDialogRef<ComentariosModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any | null) { }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.id) {
      const usr = JSON.parse(this.authService.getUsrFromLocalStorage());
      this.usuario = usr.USUAPELLIDO + ' ' + usr.USUNOMBRE;
      this.agendaService.getComentariosAgendaActividad(this.data.id).subscribe(resp => {
        console.log(resp);
        this.comentarios = resp;
        this.cantComentarios = this.comentarios.length;
      });
    }
    this.dialogRef.beforeClosed().subscribe(resp => {
      this.onNoClick();
    });
  }

  guardarComentario(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.comentario.id = 0;
    this.comentario.comentario
    this.comentario.fecha = this.getFechaActual();
    this.comentario.estado = 'PENDIENTE';
    this.comentario.id_agenda = this.data.id;
    this.comentario.usuario = this.usuario;

    this.agendaService.setComentarioAgendaActividad(this.comentario).subscribe((resp: ComentarioAgenda) => {
      console.log(resp);
      this.comentario.id = resp.id;
      this.comentarios.push(this.comentario);
      this.cantComentarios = this.comentarios.length;
      this.comentario = new ComentarioAgenda();
    });
  }

  eliminar(id: string, index: number) {
    this.agendaService.deleteComentarioAgendaActividad(id).subscribe(resp => {
      this.comentarios.splice(index, 1);
      this.cantComentarios = this.comentarios.length;
    });
  }

  cambiarEstado(comentario: ComentarioAgenda) {

    comentario.fecha = comentario.fecha.replace('T', ' ').replace('.000Z', '')
    comentario.estado = comentario.estado == 'PENDIENTE' ? 'REVISADO': 'PENDIENTE';
    this.agendaService.putComentarioAgendaActividad(comentario).subscribe(resp => {
      console.log(resp);
    });
  }

  getFechaActual() {
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

  onNoClick(): void {
    this.dialogRef.close({
      comentarios: this.cantComentarios
    });
  }

}
