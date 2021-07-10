import { States, Status, TorrentInfo, Tracker } from '../interfaces/data';

export class Torrents {
	private torrents: { [key: string]: TorrentInfo } = {};
	private torrentsLength: number = 0;

	public status: Status = {
		downloading: [],
		complete: [],
		stopped: [],
		active: [],
		inactive: []
	};
	public tag: string[] = [];
	public tracker: Tracker = {};
	public category: any = {};

	constructor(torrents?: { [key: string]: TorrentInfo }) {
		this.modifyTorrent(torrents);
	}

	get length(): number {
		return this.torrentsLength;
	}

	modifyTorrent(torrents?: { [key: string]: TorrentInfo }) {
		for (const key in torrents) {
			if (!this.torrents[key]) {
				this.torrents[key] = torrents[key];
				this.torrentsLength += 1;
				this.setFilters(torrents[key].state, key);
			} else {
				if (torrents[key].state) {
					this.setFilters(this.torrents[key].state, key, true);
					this.setFilters(torrents[key].state, key);
				}
				Object.assign(this.torrents[key], torrents[key]);
			}
		}
	}

	removeTorrent(torrents: string[]) {
		for (let i = 0; i < torrents.length; i++) {
			this.setFilters(this.torrents[torrents[i]].state, torrents[i], true);
			delete this.torrents[torrents[i]];
			this.torrentsLength -= 1;
			// this.torrents = { ...this.torrents };
		}
	}

	addToMenu(items: { [key: string]: string[] } | string[], type: 'category' | 'tag' | 'tracker') {
		if (Array.isArray(items)) {
			this[type] = items;
		} else {
			Object.assign(this[type], items);
		}
	}
	removeFromMenu(items: string[], type: 'category' | 'tag' | 'tracker') {
		for (let i = 0; i < items.length; i++) {
			delete this[type][items[i]];
		}
	}

	setFilters(state: string, key: string, remove: boolean = false) {
		switch (state) {
			case States.DOWNLOADING:
			case States.FORCED_DOWNLOAD:
				if (remove) this.status['downloading'] = this.status['downloading'].filter((v) => v != key);
				else this.status['downloading'].push(key);
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
				if (remove) this.status['complete'] = this.status['complete'].filter((v) => v != key);
				else this.status['complete'].push(key);
				break;
			default:
				break;
		}

		switch (state) {
			case States.PAUSED_DOWNLOAD:
			case States.PAUSED_UPLOAD:
				if (remove) this.status['stopped'] = this.status['stopped'].filter((v) => v != key);
				else this.status['stopped'].push(key);
				break;
			default:
				break;
		}

		switch (state) {
			case States.DOWNLOADING:
			case States.FORCED_DOWNLOAD:
			case States.UPLOADING:
			case States.FORCED_UPLOAD:
				if (remove) this.status['active'] = this.status['active'].filter((v) => v != key);
				else this.status['active'].push(key);
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
				if (remove) this.status['inactive'] = this.status['inactive'].filter((v) => v != key);
				else this.status['inactive'].push(key);
				break;
			default:
				break;
		}
	}
}
