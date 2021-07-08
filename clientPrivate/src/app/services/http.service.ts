import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpOptions, MainDataArgs } from '../interfaces/http';

@Injectable({
	providedIn: 'root'
})
export class HttpService {
	constructor(private http: HttpClient) {}

	get<T>(args: MainDataArgs, options: HttpOptions = {}): Promise<HttpResponse<T>> {
		let url = environment.url + args.url;
		delete args.url;

		let params: string[] = [];
		Object.entries(args).forEach(([ key, value ]) => {
			params.push(`${key}=${encodeURIComponent(value)}`);
		});

		// if (!options.cache) {
		// 	params.push(new Date().getTime());
		// }

		if (params.length > 0) {
			url += `?${params.join('&')}`;
		}

		return this.http
			.get<T>(url, {
				responseType: 'json',
				observe: 'response',
				withCredentials: true
			})
			.toPromise();
	}

	post(args: any, options: HttpOptions = {}): Promise<HttpResponse<string>> {
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
