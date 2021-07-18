import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-torrent-item-context',
  templateUrl: './torrent-item-context.component.html',
  styleUrls: ['./torrent-item-context.component.scss'],
  animations: [
    trigger('animateContext', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('.25s ease-out', style('*')),
      ]),
    ]),
  ],
})
export class TorrentItemContextComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
