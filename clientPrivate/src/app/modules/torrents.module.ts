import { stringify } from '@angular/compiler/src/util';
import {
  Filters,
  States,
  Status,
  TorrentInfo,
  Tracker,
} from '../interfaces/data';

export class Torrents {
  private torrents: { [key: string]: TorrentInfo } = {};
  private torrentsLength: number = 0;

  public filters: Filters = {
    Status: {
      downloading: [],
      complete: [],
      stopped: [],
      active: [],
      inactive: [],
    },
    Tag: [],
    Tracker: {},
    Category: {},
  };

  constructor(torrents?: { [key: string]: TorrentInfo }) {
    this.modifyTorrent(torrents);
  }

  get length(): number {
    return this.torrentsLength;
  }
  get getTorrent(): { [key: string]: TorrentInfo } {
    return this.torrents;
  }
  get getTorrentKeys() {
    return Object.keys(this.torrents);
  }

  modifyTorrent(torrents?: { [key: string]: TorrentInfo }) {
    let stateChanged: boolean = false;
    for (const key in torrents) {
      if (!this.torrents[key]) {
        this.torrents[key] = torrents[key];
        this.torrentsLength += 1;
        this.setFilters(torrents[key].state, key);
      } else {
        if (torrents[key].state) {
          this.setFilters(this.torrents[key].state, key, true);
          this.setFilters(torrents[key].state, key);
          stateChanged = true;
        }
        Object.assign(this.torrents[key], torrents[key]);
      }
    }

    if (stateChanged) this.torrents = JSON.parse(JSON.stringify(this.torrents));
  }

  removeTorrent(torrents: string[]) {
    for (let i = 0; i < torrents.length; i++) {
      this.setFilters(this.torrents[torrents[i]].state, torrents[i], true);
      delete this.torrents[torrents[i]];
      this.torrentsLength -= 1;
    }
  }

  addToMenu(
    items: { [key: string]: string[] } | string[],
    type: 'Category' | 'Tag' | 'Tracker'
  ) {
    if (Array.isArray(items)) {
      this.filters[type] = items;
    } else {
      Object.assign(this.filters[type], items);
    }
  }
  removeFromMenu(items: string[], type: 'Category' | 'Tag' | 'Tracker') {
    for (let i = 0; i < items.length; i++) {
      delete this.filters[type][items[i]];
    }
  }

  setFilters(state: string, key: string, remove: boolean = false) {
    switch (state) {
      case States.DOWNLOADING:
      case States.FORCED_DOWNLOAD:
        if (remove)
          this.filters.Status['downloading'] = this.filters.Status[
            'downloading'
          ].filter((v) => v != key);
        else this.filters.Status['downloading'].push(key);
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
        if (remove)
          this.filters.Status['complete'] = this.filters.Status[
            'complete'
          ].filter((v) => v != key);
        else this.filters.Status['complete'].push(key);
        break;
      default:
        break;
    }

    switch (state) {
      case States.PAUSED_DOWNLOAD:
      case States.PAUSED_UPLOAD:
        if (remove)
          this.filters.Status['stopped'] = this.filters.Status[
            'stopped'
          ].filter((v) => v != key);
        else this.filters.Status['stopped'].push(key);
        break;
      default:
        break;
    }

    switch (state) {
      case States.DOWNLOADING:
      case States.FORCED_DOWNLOAD:
      case States.UPLOADING:
      case States.FORCED_UPLOAD:
        if (remove)
          this.filters.Status['active'] = this.filters.Status['active'].filter(
            (v) => v != key
          );
        else this.filters.Status['active'].push(key);
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
        if (remove)
          this.filters.Status['inactive'] = this.filters.Status[
            'inactive'
          ].filter((v) => v != key);
        else this.filters.Status['inactive'].push(key);
        break;
      default:
        break;
    }
  }
}
