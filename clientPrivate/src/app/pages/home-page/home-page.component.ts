import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { States, Status, Tag, TorrentInfo, Tracker } from 'src/app/interfaces/data';
import { MainDataRes } from 'src/app/interfaces/http';
import { HttpService } from 'src/app/services/http.service';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: [ './home-page.component.scss' ]
})
export class HomePageComponent implements OnInit, OnDestroy {
	private syncMainDataLastResponseId: number = 0;
	private timeout: any;

	public torrents: { [key: string]: TorrentInfo } = {};

	public selectedStatus: string = 'all';
	public status: Status = {
		all: [],
		downloading: [],
		complete: [],
		stopped: [],
		active: [],
		inactive: []
	};
	public selectedTag: string = 'all';
	public tag: Tag = { all: [], untagged: [] };
	public selectedTracker: string = 'all';
	public tracker: Tracker = { all: [] };

	constructor(private http: HttpService) {}

	ngOnInit(): void {
		this.callMainData();
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
					if (body.full_update) {
						if (body.torrents) {
							for (const key in body.torrents) {
								this.torrents[key] = body.torrents[key];
								this.setFilters(body.torrents[key].state, key);
							}
						}
					} else {
						for (const key in body.torrents) {
							if (!this.torrents[key]) {
								this.torrents[key] = body.torrents[key];
								this.setFilters(body.torrents[key].state, key);
							} else {
								if (body.torrents[key].state) {
									this.setFilters(this.torrents[key].state, key, true);
									this.setFilters(body.torrents[key].state, key);
								}
								Object.assign(this.torrents[key], body.torrents[key]);
							}
						}
					}
					this.syncMainDataLastResponseId = body.rid;

					//this.callMainData();
					this.timeout = setTimeout(() => {
						this.callMainData();
					}, 1000);
				}
			});
	}

	setFilters(state: string, key: string, remove: boolean = false) {
		if (remove) {
			for (const name in this.status) {
				this.status[name] = this.status[name].filter((v) => v != key);
			}
			for (const name in this.tag) {
				this.tag[name] = this.tag[name].filter((v) => v != key);
			}
			for (const name in this.tracker) {
				this.tracker[name] = this.tracker[name].filter((v) => v != key);
			}
		} else {
			this.status['all'].push(key);
			this.tag['all'].push(key);
			this.tracker['all'].push(key);

			switch (state) {
				case States.DOWNLOADING:
				case States.FORCED_DOWNLOAD:
					this.status['downloading'].push(key);
					break;
				default:
					break;
			}

			switch (state) {
				case States.UPLOADING:
				case States.FORCED_UPLOAD:
				case States.PAUSED_UPLOAD:
				case States.QUEUED_UPLOAD:
				case States.STALLED_UPLOAD:
				case States.CHECKING_UPLOAD:
					this.status['complete'].push(key);
					break;
				default:
					break;
			}

			switch (state) {
				case States.PAUSED_DOWNLOAD:
				case States.PAUSED_UPLOAD:
					this.status['stopped'].push(key);
					break;
				default:
					break;
			}

			switch (state) {
				case States.DOWNLOADING:
				case States.FORCED_DOWNLOAD:
				case States.UPLOADING:
				case States.FORCED_UPLOAD:
					this.status['active'].push(key);
					break;
				default:
					break;
			}

			switch (state) {
				case States.PAUSED_DOWNLOAD:
				case States.PAUSED_UPLOAD:
				case States.STALLED_DOWNLOAD:
				case States.STALLED_UPLOAD:
				case States.MISSING_FILES:
				case States.ERROR:
					this.status['inactive'].push(key);
					break;
				default:
					break;
			}
		}
	}

	handleStatusSelect(key: string) {
		this.selectedStatus = key;
	}

	handleTagSelect(key: string) {
		this.selectedTag = key;
	}

	handleTrackerSelect(key: string) {
		this.selectedTracker = key;
	}
}
