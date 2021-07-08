import { ServerState, TorrentInfo } from './data';

export interface HttpOptions {
	cache?: boolean;
}

export interface MainDataArgs {
	url?: 'api/v2/sync/maindata';
	rid: number;
}
export interface MainDataRes {
	rid: number;
	full_update?: boolean;
	server_state: ServerState;
	categories?: { [key: string]: string[] };
	tags?: any[];
	torrents?: {
		[key: string]: TorrentInfo;
	};
	trackers?: { [key: string]: string[] };
}
