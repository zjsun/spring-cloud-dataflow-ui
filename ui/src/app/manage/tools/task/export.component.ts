import {Component} from '@angular/core';
import {ImportExportService} from '../../../shared/service/import-export.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {TaskPage} from '../../../shared/model/task.model';
import {TaskService} from '../../../shared/api/task.service';

@Component({
  selector: 'app-manage-task-export',
  template: `
    <clr-modal [(clrModalOpen)]="isOpen" [clrModalClosable]="!isRunning" clrModalSize="lg">
      <h3 class="modal-title" i18n="@@tools.modal.export_tasks.title">Export task(s)</h3>
      <div class="modal-body" *ngIf="!isRunning">
        <div>
          <ng-container i18n="@@tools.modal.export_tasks.text1">You can create an export of your</ng-container>&nbsp;
          <strong i18n="@@tools.modal.export_tasks.text2">selected tasks</strong>.<br />
          <ng-container i18n="@@tools.modal.export_tasks.text3">This operation will generate and download a</ng-container>&nbsp;
          <strong i18n="@@tools.modal.export_tasks.text4">JSON file</strong>.
        </div>
        <clr-datagrid [(clrDgSelected)]="selected" *ngIf="tasks">
          <clr-dg-column i18n="@@tools.modal.export_tasks.name">Name</clr-dg-column>
          <clr-dg-column i18n="@@tools.modal.export_tasks.definition">Definition</clr-dg-column>
          <clr-dg-row *clrDgItems="let task of tasks.items" [clrDgItem]="task">
            <clr-dg-cell>{{ task.name }}</clr-dg-cell>
            <clr-dg-cell>
              <span class="dsl-text dsl-truncate">{{ task.dslText }}</span>
            </clr-dg-cell>
          </clr-dg-row>
        </clr-datagrid>
      </div>
      <div class="modal-body" *ngIf="isRunning">
        <clr-spinner clrInline clrSmall></clr-spinner>
        <ng-container i18n="@@tools.modal.export_tasks.exporting">Exporting task(s) ...</ng-container>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" [disabled]="isRunning" (click)="isOpen = false" i18n="@@modal.cancel">Cancel</button>
        <button type="button" class="btn btn-primary" (click)="run()" [disabled]="isRunning">
          <span i18n="@@tools.modal.export_tasks.submit">Export task(s)</span>
        </button>
      </div>
    </clr-modal>
  `
})
export class TaskExportComponent {
  isOpen = false;
  isRunning = false;
  tasks: TaskPage;
  selected = [];

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService,
    private importExportService: ImportExportService
  ) {}

  open(): void {
    this.isRunning = false;
    this.isOpen = true;
    this.taskService.getTasks(0, 100000, '', 'taskName', 'ASC').subscribe((page: TaskPage) => {
      this.tasks = page;
      this.selected = [...page.items];
    });
  }

  run(): void {
    if (this.selected.length === 0) {
      this.notificationService.error('No task selected', 'Please, select task(s) to export.');
    } else {
      this.isRunning = true;
      this.importExportService.tasksExport(this.selected).subscribe(() => {
        this.notificationService.success('Task(s) export', 'Task(s) has been exported.');
        this.isOpen = false;
      });
    }
  }
}
