import {Component} from '@angular/core';
import { LocaleService } from '../../shared/service/locale.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent {
  constructor(public locale: LocaleService) {}
}
