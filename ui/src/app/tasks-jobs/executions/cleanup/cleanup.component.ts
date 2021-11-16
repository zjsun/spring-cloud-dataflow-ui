import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TaskExecution} from '../../../shared/model/task-execution.model';
import {TaskService} from '../../../shared/api/task.service';
import {NotificationService} from '../../../shared/service/notification.service';

@Component({
  selector: 'app-execution-cleanup',
  templateUrl: './cleanup.component.html'
})
export class CleanupComponent {
  isOpen = false;
  isRunning = false;
  executions: TaskExecution[];
  @Output() onCleaned = new EventEmitter();

  constructor(private taskService: TaskService, private notificationService: NotificationService) {}

  open(executions: TaskExecution[]): void {
    this.executions = executions;
    this.isRunning = false;
    this.isOpen = true;
  }

  clean(): void {
    this.isRunning = true;
    this.taskService.executionsClean(this.executions).subscribe(
      data => {
        this.notificationService.success($localize`:@@notify.execution-cleanup.title1:Clean up task execution(s)`,
          `${data.length}` + $localize`:@@notify.execution-cleanup.body1: task execution(s) cleaned up.`);
        this.onCleaned.emit(data);
        this.isOpen = false;
        this.executions = null;
      },
      error => {
        this.notificationService.error($localize`:@@notify.error.title:An error occurred`, error);
        this.isOpen = false;
        this.executions = null;
      }
    );
  }
}
