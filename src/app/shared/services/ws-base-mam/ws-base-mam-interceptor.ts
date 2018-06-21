import { WsAppStateService } from './../../../ws-app-state.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WsBaseMamInterceptor implements HttpInterceptor {

  constructor(private appState: WsAppStateService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newHeaders: HttpHeaders;
    let newReq = req.clone();

    if (!req.headers.has('CIS-Request') && this.appState.authHeader) {
      newHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': `application/json`,
        'Authorization': this.appState.authHeader
      });
      newReq = req.clone({ headers: newHeaders });
    }

    return next.handle(newReq);
  }
}
