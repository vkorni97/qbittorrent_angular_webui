import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';

@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: [ './login-page.component.scss' ],
	animations: [
		trigger('error', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translate3d(0, -50%, 0)' }),
				animate('.25s ease-out', style('*'))
			]),
			transition(':leave', [
				animate('.25s ease-out', style({ opacity: 0, transform: 'translate3d(0, -50%, 0)' }))
			])
		])
	]
})
export class LoginPageComponent implements OnInit {
	public formGroup: FormGroup;
	public errorMsg: string | undefined;

	constructor(private formBuilder: FormBuilder, private http: HttpService) {}

	ngOnInit(): void {
		this.formGroup = this.formBuilder.group({
			username: [ '' ],
			password: [ '' ]
		});
		this.errorMsg = 'Invalid username or password';
	}

	handleSubmit() {
		this.http.post({ url: 'api/v2/auth/login', ...this.formGroup.value }).then((res) => {
			if (res.status === 200 && res.body == 'Ok.') {
				window.location.reload();
			} else {
				this.errorMsg = undefined;
				setTimeout(() => {
					this.errorMsg = 'Invalid username or password';
				}, 0);
			}
		});
	}
}
