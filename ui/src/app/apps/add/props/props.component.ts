import {Component} from '@angular/core';
import {AppService} from '../../../shared/api/app.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {KeyValueValidator} from '../../../shared/component/key-value/key-value.validator';

@Component({
  selector: 'app-add-props',
  templateUrl: './props.component.html'
})
export class PropsComponent {
  form: FormGroup;
  isImporting = false;
  validators = {
    key: [Validators.required],
    value: [Validators.required]
  };

  constructor(
    private appService: AppService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.form = new FormGroup({
      properties: new FormControl('', [KeyValueValidator.validateKeyValue(this.validators), Validators.required]),
      force: new FormControl(false)
    });
  }

  submit(): void {
    if (!this.form.valid) {
      this.notificationService.error($localize`:@@notify.error.app-add-props.title:Invalid field(s)`, $localize`:@@notify.error.app-add-props.body:Some field(s) are missing or invalid.`);
    } else {
      this.isImporting = true;
      this.appService
        .importProps(this.form.get('properties').value.toString(), this.form.get('force').value)
        // .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
        .subscribe(
          () => {
            this.notificationService.success($localize`:@@notify.success.app-add-props.title:Import application(s)`, $localize`:@@notify.success.app-add-props.body:Application(s) Imported.`);
            this.back();
          },
          () => {
            this.isImporting = false;
            this.notificationService.error(
              $localize`:@@notify.error.title:An error occurred`,
              $localize`:@@notify.error.app-add-props.body2:An error occurred while importing Apps. Please check the server logs for more details.`
            );
          }
        );
    }
  }

  back(): void {
    this.router.navigateByUrl('apps');
  }
}
