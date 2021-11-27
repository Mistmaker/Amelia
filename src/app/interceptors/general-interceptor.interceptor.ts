import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable()
export class GeneralInterceptorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      const authReq = request.clone({
        headers: request.headers
          .set('x-token', 'jwt-aqui')
          .set('x-eid', 'idEmpresa-Aqui')
          .set('x-pid', usuario.PERFIL_CODIGO)
          .set('x-uid', usuario.USUIDENTIFICACION)
      });
      return next.handle(authReq);
    }
    return next.handle(request);
  }
}
