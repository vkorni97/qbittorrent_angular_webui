import { KeyValue } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ServerState, TorrentInfo } from 'src/app/interfaces/data';
import { MainDataRes } from 'src/app/interfaces/http';
import { Torrents } from 'src/app/modules/torrents.module';
import { HttpService } from 'src/app/services/http.service';
import { chartOptions } from '../../_helper/chartConfig';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: [ './home-page.component.scss' ]
})
export class HomePageComponent implements OnInit, OnDestroy, AfterViewInit {
	private syncMainDataLastResponseId: number = 0;
	private mainTimer: any;
	private graphTimer: any;

	public torrents: Torrents = new Torrents();
	public server_state: ServerState = {};

	public Status: string = 'all';
	public Tag: string = 'all';
	public Tracker: string = 'all';
	public Category: string = 'all';

	@ViewChild('chart') chart: ChartComponent;
	public chartOptions = chartOptions;

	constructor(private http: HttpService) {}

	sortByState(a: KeyValue<string, TorrentInfo>, b: KeyValue<string, TorrentInfo>) {
		const sort: string[] = [
			'stalledUP',
			'uploading',
			'forcedUP',
			'checkingDL',
			'pausedDL',
			'downloading',
			'forcedDL',
			'metaDL'
		];
		const current = sort.indexOf(a.value.state); //-1
		const next = sort.indexOf(b.value.state); //
		if (current - next < 0) {
			return 1;
		} else if (current - next == 0) {
			return a.value.name.localeCompare(b.value.name);
		} else return -1;
	}

	ngOnInit(): void {
		this.callMainData();
	}

	get selectedFilters() {
		return {
			status: this.Status,
			tag: this.Tag,
			tracker: this.Tracker,
			category: this.Category
		};
	}

	ngAfterViewInit() {
		let data1: number[] = new Array();
		let data2: number[] = new Array();

		this.graphTimer = setInterval(() => {
			data1.push(this.server_state.up_info_speed || 0);
			data2.push(this.server_state.dl_info_speed || 0);
			this.chart.updateSeries([
				{
					name: 'Download',
					data: data2,
					color: '#39CE83'
				},
				{
					name: 'Upload',
					data: data1,
					color: '#00CCCC'
				}
			]);
		}, 1000);
	}

	ngOnDestroy(): void {
		if (this.mainTimer) clearTimeout(this.mainTimer);
		if (this.graphTimer) clearInterval(this.graphTimer);
	}

	callMainData() {
		this.http
			.get<MainDataRes>({ url: 'api/v2/sync/maindata', rid: this.syncMainDataLastResponseId }, { cache: false })
			.then((res) => {
				if (res && res.body) {
					let { body } = res;
					if (body.server_state) Object.assign(this.server_state, body.server_state);
					if (body.torrents) this.torrents.modifyTorrent(body.torrents);
					if (body.torrents_removed) this.torrents.removeTorrent(body.torrents_removed);
					if (body.trackers) this.torrents.addToMenu(body.trackers, 'tracker');
					if (body.trackers_removed) this.torrents.removeFromMenu(body.trackers_removed, 'tracker');
					if (body.tags) this.torrents.addToMenu(body.tags, 'tag');
					if (body.tags_removed) this.torrents.removeFromMenu(body.tags_removed, 'tag');

					this.syncMainDataLastResponseId = body.rid;

					//this.callMainData();
					this.mainTimer = setTimeout(() => {
						this.callMainData();
					}, 1000);
				}
			});
	}

	handleSelectFilter(filter: 'Status' | 'Category' | 'Tag' | 'Tracker', key: string) {
		this[filter] = key;
	}
}
