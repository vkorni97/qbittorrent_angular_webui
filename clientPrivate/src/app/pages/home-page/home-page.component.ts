import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { MainDataRes } from 'src/app/interfaces/http';
import { Torrents } from 'src/app/modules/torrents.module';
import { HttpService } from 'src/app/services/http.service';
import { chartOptions } from '../../_helper/config';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: [ './home-page.component.scss' ]
})
export class HomePageComponent implements OnInit, OnDestroy, AfterViewInit {
	private syncMainDataLastResponseId: number = 0;
	private timeout: any;

	public torrents: Torrents = new Torrents();

	public selectedStatus: string = 'all';
	public selectedTag: string = 'all';
	public selectedTracker: string = 'all';

	@ViewChild('chart') chart: ChartComponent;
	public chartOptions = chartOptions;

	constructor(private http: HttpService) {}

	ngOnInit(): void {
		this.callMainData();
	}

	ngAfterViewInit() {
		let data1: number[] = new Array(10).fill(0);
		let data2: number[] = new Array(10).fill(0);

		setInterval(() => {
			data1.push(this.torrents.uploadSpeed);
			data2.push(this.torrents.downloadSpeed);
			this.chart.updateSeries([
				{
					name: 'Download',
					data: data2
				},
				{
					name: 'Upload',
					data: data1
				}
			]);
		}, 1000);
	}

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
