import {Component} from '@angular/core';
import {StreamPage} from '../../../shared/model/stream.model';
import {StreamService} from '../../../shared/api/stream.service';
import {ImportExportService} from '../../../shared/service/import-export.service';
import {NotificationService} from '../../../shared/service/notification.service';

@Component({
  selector: 'app-manage-stream-export',
  template: `
    <clr-modal [(clrModalOpen)]="isOpen" [clrModalClosable]="!isRunning" clrModalSize="lg">
      <h3 class="modal-title" i18n="@@tools.modal.export_streams.title">Export stream(s)</h3>
      <div class="modal-body" *ngIf="!isRunning">
        <div>
          <ng-container i18n="@@tools.modal.export_streams.text1">You can create an export of your</ng-container>&nbsp;
          <strong i18n="@@tools.modal.export_streams.text2">selected streams</strong>
          <ng-container i18n="@@tools.modal.export_streams.text3">.</ng-container><br />
          <ng-container i18n="@@tools.modal.export_streams.text4">This operation will generate and download a</ng-container>&nbsp;
          <strong i18n="@@tools.modal.export_streams.text5">JSON file</strong>.
        </div>
        <clr-datagrid [(clrDgSelected)]="selected" *ngIf="streams">
          <clr-dg-column i18n="@@tools.modal.export_streams.name">Name</clr-dg-column>
          <clr-dg-column i18n="@@tools.modal.export_streams.definition">Definition</clr-dg-column>
          <clr-dg-row *clrDgItems="let stream of streams.items" [clrDgItem]="stream">
            <clr-dg-cell>{{ stream.name }}</clr-dg-cell>
            <clr-dg-cell>
              <span class="dsl-text dsl-truncate">{{ stream.dslText }}</span>
            </clr-dg-cell>
          </clr-dg-row>
        </clr-datagrid>
      </div>
      <div class="modal-body" *ngIf="isRunning">
        <clr-spinner clrInline clrSmall></clr-spinner>
        <ng-container i18n="@@tools.modal.export_streams.exporting">Exporting stream(s) ...</ng-container>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" [disabled]="isRunning" (click)="isOpen = false" i18n="@@modal.cancel">Cancel</button>
        <button type="button" class="btn btn-primary" (click)="run()" [disabled]="isRunning">
          <span i18n="@@tools.modal.export_streams.submit">Export stream(s)</span>
        </button>
      </div>
    </clr-modal>
  `
})
export class StreamExportComponent {
  isOpen = false;
  isRunning = false;
  streams: StreamPage;
  selected = [];

  constructor(
    private streamService: StreamService,
    private notificationService: NotificationService,
    private importExportService: ImportExportService
  ) {}

  open(): void {
    this.isRunning = false;
    this.isOpen = true;
    this.streamService.getStreams(0, 100000, '', 'name', 'ASC').subscribe((page: StreamPage) => {
      this.streams = page;
      this.selected = [...page.items];
    });
  }

  run(): void {
    if (this.selected.length === 0) {
      this.notificationService.error($localize`:@@notify.app-stream-export.title1:No stream selected`, $localize`:@@notify.app-stream-export.body1:Please, select stream(s) to export.`);
    } else {
      this.isRunning = true;
      this.importExportService.streamsExport(this.selected).subscribe(() => {
        this.notificationService.success($localize`:@@notify.app-stream-export.title2:Stream(s) export`, $localize`:@@notify.app-stream-export.body2:Stream(s) has been exported.`);
        this.isOpen = false;
      });
    }
  }
}
