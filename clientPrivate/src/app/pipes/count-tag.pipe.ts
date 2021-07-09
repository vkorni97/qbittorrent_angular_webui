import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countTag'
})
export class CountTagPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
