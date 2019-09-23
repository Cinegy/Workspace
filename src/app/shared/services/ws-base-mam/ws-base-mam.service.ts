import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { WsMamError } from './ws-mam-error';
import { Subject } from 'rxjs/Subject';
import { WsAppStateService } from 'src/app/ws-app-state.service';

@Injectable({
  providedIn: 'root'
})
export class WsBaseMamService {
  constructor(
    protected httpClient: HttpClient,
    protected appState: WsAppStateService) {}

  protected get(url: string, subject: Subject<any>, extraSubjectData?: any) {
    url = this.setProtocol(url);
    const now = Date.now();

    if (url.indexOf('?') === -1) {
      url += `?timestamp=${now}`;
    } else {
      url += `&timestamp=${now}`;
    }

    this.httpClient
      .get(url)
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
    url = this.setProtocol(url);

    this.httpClient
      .post(url, payload)
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
    url = this.setProtocol(url);

    this.httpClient
      .put(url, payload)
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
    url = this.setProtocol(url);

    this.httpClient
      .delete(url)
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
      // console.log(mamError.msg);
    } else if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      mamError.msg = err.error.message;
      // console.log('An error occurred:', mamError.msg);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      mamError.msg = `Backend returned code ${err.status}, message was: ${err.error.error}`;
      mamError.status = err.status;
      // console.log(mamError.msg);
    }

    if (extraSubjectData) {
      mamError.extMsg = extraSubjectData;
    }

    if (subject) {
      subject.next(mamError);
    }

    throw mamError;

  }

  // This is only a hack. MAM service does not support https right now.
  private setProtocol(url: string) {
    const isHttps = this.appState.selectedMam.mamEndpoint.startsWith('https');

    if (isHttps) {
      if (!url.startsWith('https')) {
        url = url.replace('http', 'https');
        return url;
      } else {
        return url;
      }
    } else {
      return url;
    }
  }

}
