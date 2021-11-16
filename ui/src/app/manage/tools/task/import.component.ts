import {Component} from '@angular/core';
import {NotificationService} from '../../../shared/service/notification.service';
import {ImportExportService} from '../../../shared/service/import-export.service';

@Component({
  selector: 'app-manage-task-import',
  template: `
    <clr-modal
      [(clrModalOpen)]="isOpen"
      [clrModalClosable]="view !== 'loading'"
      [clrModalSize]="view === 'result' ? 'lg' : 'md'"
    >
      <h3 class="modal-title" i18n="@@tools.modal.import_tasks.title">Import task(s)</h3>
      <div class="modal-body clr-form clr-form-horizontal" *ngIf="view === 'file'">
        <div>
          <ng-container i18n="@@tools.modal.import_tasks.text1">You can import your tasks from a</ng-container>&nbsp;
          <strong i18n="@@tools.modal.import_tasks.text2">JSON file</strong>
          <ng-container i18n="@@tools.modal.import_tasks.text3">.</ng-container><br />
          <ng-container i18n="@@tools.modal.import_tasks.text4">The file needs to be modified for sensitive properties before importing.</ng-container>
        </div>
        <div class="clr-form-control clr-row">
          <label class="clr-col-2 clr-control-label" i18n="@@tools.modal.import_tasks.json_file">JSON file</label>
          <div class="clr-control-container clr-col-10">
            <div class="clr-file-input-wrapper">
              <label for="file">
                <span class="filename text-truncate">{{ file?.name }}</span>
                <span class="btn btn-sm btn-secondary" i18n="@@tools.modal.import_tasks.json_file.placeholder">Select a file</span>
                <input name="file" id="file" type="file" (change)="fileChanged($event)" />
              </label>
            </div>
          </div>
        </div>
        <clr-checkbox-container class="clr-form-control clr-row">
          <label class="clr-col-2" i18n="@@tools.modal.import_tasks.options">Options</label>
          <clr-checkbox-wrapper>
            <input
              type="checkbox"
              clrCheckbox
              name="options"
              value="option1"
              [(ngModel)]="excludeChildren"
              class="clr-col-10"
            />
            <label i18n="@@tools.modal.import_tasks.options.label">Exclude children</label>
          </clr-checkbox-wrapper>
        </clr-checkbox-container>
      </div>
      <div class="modal-body" *ngIf="view === 'result'">
        <div>
          <ng-container i18n="@@tools.modal.import_tasks.text5">File:</ng-container>&nbsp;<strong>{{ file?.name }}</strong><br />
          <ng-container i18n="@@tools.modal.import_tasks.text6">Duration:</ng-container>&nbsp;<strong>{{ result.duration }}s</strong>
        </div>
        <div *ngIf="result.error.length > 0">
          <h4>{{ result.error.length }}&nbsp;<ng-container i18n="@@tools.modal.import_tasks.errors">error(s)</ng-container></h4>
          <clr-datagrid class="clr-datagrid-no-fixed-height">
            <clr-dg-column [style.width.px]="10">&nbsp;</clr-dg-column>
            <clr-dg-column i18n="@@tools.modal.import_tasks.errors.description">Description</clr-dg-column>
            <clr-dg-row *clrDgItems="let task of result.error; index as i">
              <clr-dg-cell>
                <clr-icon shape="error-standard" class="is-solid"></clr-icon>
              </clr-dg-cell>
              <clr-dg-cell>
                <div style="padding-bottom: 6px;">
                  <strong>{{ task.name }}</strong>
                </div>
                <div style="padding-bottom: 4px;">
                  <span class="dsl-text dsl-truncate">{{ task.dslText }}</span>
                </div>
                <div class="error">
                  <ng-container i18n="@@tools.modal.import_tasks.errors.msg">Message:</ng-container>&nbsp;{{ task.message }}<br />
                  <ng-container i18n="@@tools.modal.import_tasks.errors.idx">Index:</ng-container>&nbsp;{{ i }}
                </div>
              </clr-dg-cell>
            </clr-dg-row>
          </clr-datagrid>
        </div>
        <div *ngIf="result.success.length > 0">
          <h4>{{ result.success.length }}&nbsp;<ng-container i18n="@@tools.modal.import_tasks.tasks">task(s) created</ng-container></h4>
          <clr-datagrid class="clr-datagrid-no-fixed-height">
            <clr-dg-column [style.width.px]="10">&nbsp;</clr-dg-column>
            <clr-dg-column i18n="@@tools.modal.import_tasks.tasks.description">Description</clr-dg-column>
            <clr-dg-row *clrDgItems="let task of result.success">
              <clr-dg-cell>
                <clr-icon shape="success-standard" class="is-solid"></clr-icon>
              </clr-dg-cell>
              <clr-dg-cell>
                <div style="padding-bottom: 6px;">
                  <strong>{{ task.name }}</strong>
                </div>
                <div>
                  <span class="dsl-text">{{ task.dslText }}</span>
                </div>
              </clr-dg-cell>
            </clr-dg-row>
          </clr-datagrid>
        </div>
      </div>
      <div class="modal-body" *ngIf="view === 'importing'">
        <clr-spinner clrInline clrSmall></clr-spinner>
        <ng-container i18n="@@tools.modal.import_tasks.importing">Importing task(s) ...</ng-container>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" [disabled]="view === 'importing'" (click)="isOpen = false" i18n="@@modal.cancel">
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          (click)="run()"
          [disabled]="view === 'importing'"
          *ngIf="view === 'file'"
        >
          <span i18n="@@tools.modal.import_tasks.submit">Import task(s)</span>
        </button>
      </div>
    </clr-modal>
  `
})
export class TaskImportComponent {
  isOpen = false;
  excludeChildren = false;
  file: any;
  view = 'file';
  result = {
    success: [],
    error: [],
    duration: 0
  };

  constructor(private notificationService: NotificationService, private importExportService: ImportExportService) {}

  open(): void {
    this.result = {
      success: [],
      error: [],
      duration: 0
    };
    this.view = 'file';
    this.file = null;
    this.excludeChildren = false;
    this.isOpen = true;
  }

  fileChanged(event: any): void {
    try {
      this.file = event.target.files[0];
    } catch (e) {
      this.file = null;
    }
  }

  run(): void {
    if (!this.file) {
      this.notificationService.error($localize`:@@notify.app-task-import.title1:Invalid file`, $localize`:@@notify.app-task-import.body1:Please, select a file.`);
      return;
    }
    const date = new Date().getTime();
    this.view = 'importing';

    this.importExportService.tasksImport(this.file, this.excludeChildren).subscribe(
      result => {
        this.result = {
          success: result.filter(item => item.created),
          error: result.filter(item => !item.created),
          duration: Math.round((new Date().getTime() - date) / 1000)
        };
        this.view = 'result';
      },
      () => {
        this.view = 'file';
        this.notificationService.error($localize`:@@notify.app-task-import.title2:Invalid file`, $localize`:@@notify.app-task-import.body2:The file is not valid.`);
      }
    );
  }
}
