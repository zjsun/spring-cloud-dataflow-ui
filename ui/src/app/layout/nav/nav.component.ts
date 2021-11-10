import { Component } from '@angular/core';
import { SecurityService } from '../../security/service/security.service';
import { LocaleService } from '../../shared/service/locale.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  shouldProtect = this.securityService.shouldProtect();

  constructor(private securityService: SecurityService, public locale: LocaleService) {
  }
}
