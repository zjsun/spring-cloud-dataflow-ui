import { Inject, Injectable, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
// @ts-ignore
import zh from '../../../locale/runtime.zh.json';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'i18n'
})
export class I18nPipe implements PipeTransform {

  constructor(
    @Inject(LOCALE_ID) public locale: string
  ) {
  }

  get isZh(): boolean {
    return this.locale === 'zh';
  }

  transform(value: any, prefix: string = ''): string {
    return value && this.isZh ? ((zh[prefix] ? zh[prefix][value.toString().toLowerCase()] : value) || value) : value;
  }

}
