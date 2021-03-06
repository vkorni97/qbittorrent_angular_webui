import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MainDataArgs } from '../interfaces/http';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  get<T>(args: MainDataArgs): Promise<HttpResponse<T>> {
    let url = environment.url + args.url;
    delete args.url;

    let params = new HttpParams();
    Object.entries(args).forEach(([key, value]) => {
      params = params.append(key, encodeURIComponent(value));
    });

    return this.http
      .get<T>(url, {
        params,
        responseType: 'json',
        observe: 'response',
        withCredentials: true,
      })
      .toPromise();
  }

  post(args: any): Promise<HttpResponse<string>> {
    const url = args.url;
    delete args.url;

    return this.http
      .post(environment.url + url, createFormData(args), {
        responseType: 'text',
        observe: 'response',
      })
      .toPromise();
  }
}

function createFormData(args: Object): FormData {
  let formData: FormData = new FormData();

  Object.entries(args).forEach(([key, value]) => {
    formData.append(key, encodeURIComponent(value));
  });

  return formData;
}
