import {Component} from '@angular/core';

@Component({
  selector: 'app-stream-status',
  template: `
    <clr-modal [(clrModalOpen)]="isOpen">
      <h3 class="modal-title" i18n="@@streams.status.title">Stream status</h3>
      <div class="modal-body">
        <div class="list-status">
          <div>
            <span class="status"><span class="label label-stream deploying">{{'DEPLOYING' | i18n:'stream.status'}}</span></span>
            <span class="desc" i18n="@@streams.status.deploying">Deployment has been initiated</span>
          </div>
          <div>
            <span class="status"><span class="label label-stream deployed">{{'DEPLOYED' | i18n:'stream.status'}}</span></span>
            <span class="desc" i18n="@@streams.status.deployed">Fully deployed based on each of the stream's apps' count properties</span>
          </div>
          <div>
            <span class="status"><span class="label label-stream incomplete">{{'PARTIAL' | i18n:'stream.status'}}</span></span>
            <span class="desc" i18n="@@streams.status.partial">1 or more of the apps are not yet deployed.</span>
          </div>
          <div>
            <span class="status"><span class="label label-stream incomplete">{{'INCOMPLETE' | i18n:'stream.status'}}</span></span>
            <span class="desc" i18n="@@streams.status.incomplete">At least 1 of each app, but 1 or more of them not at requested capacity</span>
          </div>
          <div>
            <span class="status"><span class="label label-stream failed">{{'FAILED' | i18n:'stream.status'}}</span></span>
            <span class="desc" i18n="@@streams.status.failed">1 or more of the apps does not have even a single instance deployed</span>
          </div>
          <div>
            <span class="status"><span class="label label-stream undeployed">{{'UNDEPLOYED' | i18n:'stream.status'}}</span></span>
            <span class="desc" i18n="@@streams.status.undeployed">Intentionally undeployed, or created but not yet deployed</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" (click)="close()" i18n="@@modal.close">Close</button>
      </div>
    </clr-modal>
  `
})
export class StatusComponent {
  isOpen = false;

  constructor() {}

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }
}
