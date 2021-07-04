import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginArgs } from '../interfaces/http';

@Injectable({
	providedIn: 'root'
})
export class HttpService {
	constructor(private http: HttpClient) {}

	post(args: LoginArgs): Promise<HttpResponse<string>> {
		const url = args.url;
		delete args.url;

		return this.http
			.post(environment.url + url, createFormData(args), {
				responseType: 'text',
				observe: 'response'
			})
			.toPromise();
	}
}

function createFormData(args: Object): FormData {
	let formData: FormData = new FormData();

	Object.entries(args).forEach(([ key, value ]) => {
		formData.append(key, encodeURIComponent(value));
	});

	return formData;
}
