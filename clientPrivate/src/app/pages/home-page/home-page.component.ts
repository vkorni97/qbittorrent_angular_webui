import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartOptions } from 'src/app/interfaces/data';
import { MainDataRes } from 'src/app/interfaces/http';
import { Torrents } from 'src/app/modules/torrents.module';
import { HttpService } from 'src/app/services/http.service';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: [ './home-page.component.scss' ]
})
export class HomePageComponent implements OnInit, OnDestroy {
	private syncMainDataLastResponseId: number = 0;
	private timeout: any;

	public torrents: Torrents = new Torrents();

	public selectedStatus: string = 'all';
	public selectedTag: string = 'all';
	public selectedTracker: string = 'all';

	public chartOptions: ChartOptions = {
		annotations: {},
		chart: {
			height: 200,
			type: 'area',
			toolbar: { show: false },
			selection: { enabled: false }
		},
		colors: [],
		dataLabels: { enabled: false },
		labels: [],
		legend: {},
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 0,
				opacityFrom: 0.8,
				opacityTo: 0,
				stops: [ 0, 100 ]
			}
		},
		tooltip: { enabled: false },
		plotOptions: {},
		responsive: [],
		states: {},
		subtitle: {},
		theme: {},
		grid: { borderColor: 'transparent' },
		stroke: { curve: 'smooth' },
		series: [
			{
				name: 'asd',
				data: [ 10, 41, 35, 51, 49, 62, 69, 91, 148 ]
			}
		],
		title: {},
		xaxis: {
			labels: { show: false },
			axisBorder: { show: false },
			axisTicks: { show: false },
			categories: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep' ]
		},
		yaxis: { labels: { show: false } }
	};

	constructor(private http: HttpService) {}

	ngOnInit(): void {}

	ngOnDestroy(): void {
		if (this.timeout) clearTimeout(this.timeout);
	}

	callMainData() {
		this.http
			.get<MainDataRes>({ url: 'api/v2/sync/maindata', rid: this.syncMainDataLastResponseId }, { cache: false })
			.then((res) => {
				if (res && res.body) {
					let { body } = res;
					if (body.torrents) this.torrents.modifyTorrent(body.torrents);
					if (body.torrents_removed) this.torrents.removeTorrent(body.torrents_removed);
					if (body.trackers) this.torrents.addToMenu(body.trackers, 'tracker');
					if (body.trackers_removed) this.torrents.removeFromMenu(body.trackers_removed, 'tracker');
					if (body.tags) this.torrents.addToMenu(body.tags, 'tag');
					if (body.tags_removed) this.torrents.removeFromMenu(body.tags_removed, 'tag');

					this.syncMainDataLastResponseId = body.rid;

					//this.callMainData();
					this.timeout = setTimeout(() => {
						this.callMainData();
					}, 1000);
				}
			});
	}

	removeFilter(oldState: string, newState: string, key: string) {}

	handleStatusSelect(key: string) {
		this.selectedStatus = key;
	}

	handleTagSelect(key: string) {
		this.selectedTag = key;
	}

	handleTrackerSelect(key: string) {
		console.log(key);
		this.selectedTracker = key;
	}
}
