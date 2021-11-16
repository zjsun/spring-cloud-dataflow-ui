import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Stream} from '../../../shared/model/stream.model';
import {StreamService} from '../../../shared/api/stream.service';
import {NotificationService} from '../../../shared/service/notification.service';

@Component({
  selector: 'app-stream-undeploy',
  templateUrl: './undeploy.component.html',
  styles: []
})
export class UndeployComponent {
  streams: Stream[];
  isOpen = false;
  isRunning = false;
  @Output() onUndeployed = new EventEmitter();

  constructor(private streamService: StreamService, private notificationService: NotificationService) {}

  open(streams: Stream[]): void {
    this.streams = streams;
    this.isOpen = true;
  }

  unregister(): void {
    this.isRunning = true;
    this.streamService.undeployStreams(this.streams).subscribe(
      data => {
        if (data.length === 1) {
          this.notificationService.success(
            $localize`:@@notify.stream-rollback-un.title1:Undeploy stream`,
            $localize`:@@notify.stream-rollback-un.body1:Successfully undeploy stream "` + this.streams[0].name + '".'
          );
        } else {
          this.notificationService.success($localize`:@@notify.stream-rollback-un.title2:Undeploy streams`,
            `${data.length}` + $localize`:@@notify.stream-rollback-un.body2: stream(s) undeployed.`);
        }
        this.onUndeployed.emit(data);
        this.isOpen = false;
        this.isRunning = false;
        this.streams = null;
      },
      error => {
        this.notificationService.error(
          $localize`:@@notify.error.title:An error occurred`,
          $localize`:@@notify.stream-rollback-un.body3:An error occurred while undeploying Streams. Please check the server logs for more details.`
        );
        this.isOpen = false;
        this.isRunning = false;
        this.streams = null;
      }
    );
  }
}
