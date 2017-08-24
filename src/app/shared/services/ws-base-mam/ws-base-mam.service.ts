import { WsAppStateService } from './../../../ws-app-state.service';
import { WsMamConnection } from './ws-mam-connection';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { WsMamError } from './ws-mam-error';

@Injectable()
export class WsBaseMamService {
  protected headers: HttpHeaders;
  protected token: string;

  constructor(
    protected httpClient: HttpClient,
    protected appState: WsAppStateService) {
    this.token = this.appState.authHeader;

    this.headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', this.token);
  }

  protected get(url: string, subject: Subject<any>, extraSubjectData?: any) {
    this.httpClient
      .get(url, { headers: this.headers })
      .subscribe(
      data => {
        if (subject) {
          if (extraSubjectData) {
            subject.next({extra: extraSubjectData, payload: data});
          } else {
            subject.next(data);
          }
        }
      },
      (err: HttpErrorResponse) => {
        if (extraSubjectData) {
          this.handleError(err, subject, extraSubjectData);
        } else {
          this.handleError(err, subject);
        }
      });
  }

  protected post(url: string, payload: any, subject: Subject<any>) {
    this.httpClient
      .post(url, payload, { headers: this.headers })
      .subscribe(
      data => {
        if (subject) {
          subject.next(data);
        }
      },
      (err: HttpErrorResponse) => {
        this.handleError(err, subject);
      }
      );
  }

  protected put(url: string, payload: any, subject: Subject<any>) {
    this.httpClient
      .put(url, payload, { headers: this.headers })
      .subscribe(
      data => {
        if (subject) {
          subject.next(data);
        }
      },
      (err: HttpErrorResponse) => {
        this.handleError(err, subject);
      });
  }

  protected delete(url: string, subject: Subject<any>) {
    this.httpClient
      .delete(url, { headers: this.headers })
      .subscribe(
      data => {
        if (subject) {
          subject.next(data);
        }
      },
      (err: HttpErrorResponse) => {
        this.handleError(err, subject);
      });
  }

  private handleError(err: HttpErrorResponse, subject: Subject<any>, extraSubjectData?: any) {
    const mamError = new WsMamError();

    if (!err.error || !err.error.error) {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      mamError.msg = `Backend returned code ${err.status}, message was: ${err.message}`;
      mamError.status = err.status;
      console.log(mamError.msg);
    } else if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      mamError.msg = err.error.message;
      console.log('An error occurred:', mamError.msg);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      mamError.msg = `Backend returned code ${err.status}, message was: ${err.error.error}`;
      mamError.status = err.status;
      console.log(mamError.msg);
    }

    if (extraSubjectData) {
      mamError.extMsg = extraSubjectData;
    } 
    subject.next(mamError);

  }

}
