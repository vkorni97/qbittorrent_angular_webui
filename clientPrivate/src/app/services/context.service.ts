import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContextService {
  public contextMenu: Subject<any> = new Subject<any>();
  constructor() {}
}
