import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { APIEndpoint } from '../api_config/BaseUrl';
@Injectable({
  providedIn: 'root'
})
export class ZoomApiService {
  private BASE_URL: string;
  constructor(private http: HttpClient,) {
    this.BASE_URL = APIEndpoint.BaseUrl;
  }


  createToken(objPayload: any): Observable<any> {
    const url = this.BASE_URL + 'api/zoom_auth';
    return this.http.post(url, objPayload)
      .map(res => {
        return res;
      })
      .catch((e: any) => {
        return Observable.throw(e);
      });
  }
  getZoomToken(objPayload: any): Observable<any> {
    const url = this.BASE_URL + 'api/zoom_auth/getZoomToken';
    return this.http.post(url, objPayload)
      .map(res => {
        return res;
      })
      .catch((e: any) => {
        return Observable.throw(e);
      });
  }
  deleteZoomToken(objPayload: any): Observable<any> {
    const url = this.BASE_URL + 'api/zoom_auth/deleteZoomToken';
    return this.http.post(url, objPayload)
      .map(res => {
        return res;
      })
      .catch((e: any) => {
        return Observable.throw(e);
      });
  }
  getZoomMeeting(objPayload: any): Observable<any> {
    const url = this.BASE_URL + 'api/zoom_auth/getZoomMeeting';
    return this.http.post(url, objPayload)
      .map(res => {
        return res;
      })
      .catch((e: any) => {
        console.log(e)
        return Observable.throw(e);
      });
  }
  getZoomRecordings(objPayload: any): Observable<any> {
    const url = this.BASE_URL + 'api/zoom_auth/getZoomRecordings';
    return this.http.post(url, objPayload)
      .map(res => {
        return res;
      })
      .catch((e: any) => {
        return Observable.throw(e);
      });
  }
}
