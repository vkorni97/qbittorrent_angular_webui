import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'convertSpeed'
})
export class ConvertSpeedPipe implements PipeTransform {
	private units: string[] = [ 'MiB/s' ];
	transform(value: number): string {
		for (let i = this.units.length; i > 0; i--) {
			const num = value / 1024 ** (i + 1);
			if (Math.floor(num) > 0) {
				return `${num.toFixed(2)} ${this.units[i - 1]}`;
			}
		}
		return `${Math.floor(value / 1024)} KiB/s`;
	}
}
