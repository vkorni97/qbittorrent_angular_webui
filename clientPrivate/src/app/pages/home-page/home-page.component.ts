import { KeyValue } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import {
  SelectedFilters,
  ServerState,
  Status,
  TorrentInfo,
  Tracker,
} from 'src/app/interfaces/data';
import { MainDataRes } from 'src/app/interfaces/http';
import { Torrents } from 'src/app/modules/torrents.module';
import { HttpService } from 'src/app/services/http.service';
import { sort } from 'src/app/_helper/variables';
import { chartOptions } from '../../_helper/chartConfig';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy, AfterViewInit {
  private syncMainDataLastResponseId: number = 0;
  private mainTimer: any;
  private graphTimer: any;

  public torrents: Torrents = new Torrents();
  public server_state: ServerState = {};

  public selectedFilters: SelectedFilters = {
    Status: 'all',
    Tag: 'all',
    Tracker: 'all',
    Category: 'all',
  };

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions = chartOptions;

  constructor(private http: HttpService) {}

  sortByState(
    a: KeyValue<string, TorrentInfo>,
    b: KeyValue<string, TorrentInfo>
  ) {
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

  ngAfterViewInit() {
    let data1: number[] = new Array(21).fill(0);
    let data2: number[] = new Array(21).fill(0);

    this.graphTimer = setInterval(() => {
      data1.push(this.server_state.up_info_speed || 0);
      data2.push(this.server_state.dl_info_speed || 0);
      this.chart.updateSeries([
        {
          name: 'Download',
          data: data2,
          color: '#39CE83',
        },
        {
          name: 'Upload',
          data: data1,
          color: '#00CCCC',
        },
      ]);
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.mainTimer) clearTimeout(this.mainTimer);
    if (this.graphTimer) clearInterval(this.graphTimer);
  }

  callMainData() {
    this.http
      .get<MainDataRes>({
        url: 'api/v2/sync/maindata',
        rid: this.syncMainDataLastResponseId,
      })
      .then((res) => {
        if (res && res.body) {
          let { body } = res;
          if (body.server_state)
            Object.assign(this.server_state, body.server_state);
          if (body.torrents) this.torrents.modifyTorrent(body.torrents);
          if (body.torrents_removed)
            this.torrents.removeTorrent(body.torrents_removed);
          if (body.categories)
            this.torrents.addToMenu(body.categories, 'Category');
          if (body.categories_removed)
            this.torrents.removeFromMenu(body.categories_removed, 'Category');
          if (body.trackers) this.torrents.addToMenu(body.trackers, 'Tracker');
          if (body.trackers_removed)
            this.torrents.removeFromMenu(body.trackers_removed, 'Tracker');
          if (body.tags) this.torrents.addToMenu(body.tags, 'Tag');
          if (body.tags_removed)
            this.torrents.removeFromMenu(body.tags_removed, 'Tag');

          this.syncMainDataLastResponseId = body.rid;

          //this.callMainData();
          this.mainTimer = setTimeout(() => {
            this.callMainData();
          }, 1000);
        }
      })
      .catch(() => {
        this.mainTimer = setTimeout(() => {
          this.callMainData();
        }, 5000);
      });
  }

  handleSelectFilter(
    filter: 'Status' | 'Category' | 'Tag' | 'Tracker',
    key: string
  ) {
    this.selectedFilters[filter] = key;
    this.selectedFilters = { ...this.selectedFilters };
  }
}
