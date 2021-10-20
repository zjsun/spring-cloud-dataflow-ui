import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {SecurityService} from './security/service/security.service';
import {ModalService} from './shared/service/modal.service';
import {SettingsComponent} from './settings/settings/settings.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  shouldProtect = this.securityService.shouldProtect();
  securityEnabled = this.securityService.securityEnabled();

  constructor(
    private securityService: SecurityService,
    private modalService: ModalService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle($localize`:@@app.title:Spring Cloud Data Flow`);
  }

  openSettings(): void {
    this.modalService.show(SettingsComponent);
  }
}
