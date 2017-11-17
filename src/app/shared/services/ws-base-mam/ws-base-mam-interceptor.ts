import { WsAppStateService } from './../../../ws-app-state.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WsBaseMamInterceptor implements HttpInterceptor {

    constructor(private appState: WsAppStateService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authHeaders;

        if (this.appState.authHeader !== undefined && this.appState.authHeader != null) {
            authHeaders = new HttpHeaders()
                .append('Content-Type', 'application/json')
                .append('Authorization', this.appState.authHeader);
        }

        const authReq = req.clone({
            headers: authHeaders
        });
        return next.handle(authReq);
    }
}
