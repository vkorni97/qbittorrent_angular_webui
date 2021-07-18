import { KeyValue } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import {
  Filters,
  SelectedFilters,
  Status,
  TorrentInfo,
  Tracker,
} from '../interfaces/data';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(
    torrents: KeyValue<string, TorrentInfo>[],
    selectedFilters: SelectedFilters,
    filters: Filters
  ): KeyValue<string, TorrentInfo>[] {
    return torrents.filter((v) => {
      return (
        Object.keys(selectedFilters) as Array<keyof SelectedFilters>
      ).every((filter) => {
        if (selectedFilters[filter] == 'all') return true;
        return filters[filter][selectedFilters[filter]].includes(v.key);
      });
    });
  }
}
