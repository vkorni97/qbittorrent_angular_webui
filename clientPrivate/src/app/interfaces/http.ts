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
	categories?: {
		[key: string]: {
			name: string;
			savePath: string;
		};
	};
	categories_removed?: string[];
	tags?: string[];
	tags_removed?: string[];
	torrents?: {
		[key: string]: TorrentInfo;
	};
	torrents_removed?: string[];
	trackers?: { [key: string]: string[] };
	trackers_removed?: string[];
}
