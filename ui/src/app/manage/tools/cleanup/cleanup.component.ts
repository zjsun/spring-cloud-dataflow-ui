import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TaskService} from '../../../shared/api/task.service';
import {NotificationService} from '../../../shared/service/notification.service';

@Component({
  selector: 'app-tools-cleanup',
  templateUrl: './cleanup.component.html'
})
export class CleanupComponent {
  isOpen = false;
  isRunning = false;
  loading = true;
  count: {completed: number; all: number};
  status = 'all';
  @Output() onCleaned = new EventEmitter();

  constructor(private taskService: TaskService, private notificationService: NotificationService) {}

  open(status: string): void {
    this.status = status;
    this.loading = true;
    this.taskService.getTaskExecutionsCount().subscribe((count: {completed: number; all: number}) => {
      this.count = count;
      this.loading = false;
      if (this.count.all === 0) {
        this.notificationService.warning($localize`:@@notify.app-tools-cleanup.title1:No execution`, $localize`:@@notify.app-tools-cleanup.body1:There is no execution.`);
        this.isOpen = false;
      }
    });
    this.isRunning = false;
    this.isOpen = true;
  }

  clean(): void {
    this.isRunning = true;
    this.taskService.taskExecutionsClean(null, this.status === 'completed').subscribe(
      () => {
        this.notificationService.success(
          $localize`:@@notify.app-tools-cleanup.title2:Clean up execution(s)`,
          `${this.status === 'completed' ? this.count.completed : this.count.all}` + $localize`:@@notify.app-tools-cleanup.body2: execution(s) cleaned up.`
        );
        this.onCleaned.emit(this.count);
        this.isOpen = false;
      },
      error => {
        this.notificationService.error($localize`:@@notify.error.title:An error occurred`, error);
        this.isOpen = false;
      }
    );
  }
}
