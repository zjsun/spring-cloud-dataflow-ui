import {Inject, Injectable, LOCALE_ID} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  get pub(): boolean {
    return !this.locale.startsWith('zh');
  }

  get pri(): boolean {
    return !this.pub;
  }
}
