import { Pipe, PipeTransform } from '@angular/core';
import { Status, TorrentInfo, Tracker } from '../interfaces/data';

interface Torrents {
	[key: string]: TorrentInfo;
}
interface SelectedFilters {
	status: string;
	category: string;
	tag: string;
	tracker: string;
}
interface Filters {
	status: Status; //& { all: string[] };
	category: any;
	tag: string[];
	tracker: Tracker;
}

@Pipe({
	name: 'filter'
})
export class FilterPipe implements PipeTransform {
	transform(torrents: Torrents, selectedFilters: SelectedFilters, filters: Filters): TorrentInfo[] {
		return [];
		// console.log('asd');
		// return Object.entries(torrents)
		// 	.filter(([ key, value ]) => {
		// 		return (Object.keys(selectedFilters) as Array<keyof SelectedFilters>).every((filter) => {
		// 			return (filters[filter][key] && filters[filter][key]) || selectedFilters[filter] == 'all';
		// 		});
		// 	})
		// 	.map((v) => v[1]);
	}
}
