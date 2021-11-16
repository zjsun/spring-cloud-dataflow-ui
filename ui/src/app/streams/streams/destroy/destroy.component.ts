import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NotificationService} from '../../../shared/service/notification.service';
import {Stream} from '../../../shared/model/stream.model';
import {StreamService} from '../../../shared/api/stream.service';

@Component({
  selector: 'app-stream-destroy',
  templateUrl: './destroy.component.html',
  styles: []
})
export class DestroyComponent {
  streams: Stream[];
  isOpen = false;
  isRunning = false;
  @Output() onDestroyed = new EventEmitter();

  constructor(private streamService: StreamService, private notificationService: NotificationService) {}

  open(streams: Stream[]): void {
    this.streams = streams;
    this.isOpen = true;
  }

  unregister(): void {
    this.isRunning = true;
    this.streamService.destroyStreams(this.streams).subscribe(
      data => {
        if (data.length === 1) {
          this.notificationService.success(
            $localize`:@@notify.stream-destroy.title1:Destroy stream`,
            $localize`:@@notify.stream-destroy.body1:Successfully removed stream "` + this.streams[0].name + '".'
          );
        } else {
          this.notificationService.success($localize`:@@notify.stream-destroy.title2:Destroy streams`, `${data.length}` + $localize`:@@notify.stream-destroy.body2: stream(s) destroyed.`);
        }
        this.isRunning = false;
        this.onDestroyed.emit(data);
        this.isOpen = false;
        this.streams = null;
      },
      error => {
        this.isRunning = false;
        this.notificationService.error(
          $localize`:@@notify.error.title:An error occurred`,
          $localize`:@@notify.stream-destroy.body3:An error occurred while bulk deleting Streams. Please check the server logs for more details.`
        );
        this.isOpen = false;
        this.streams = null;
      }
    );
  }
}
