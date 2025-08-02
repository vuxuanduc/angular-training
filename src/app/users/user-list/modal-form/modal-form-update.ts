import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'nz-demo-modal-async',
  standalone: true,
  imports: [
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
  ],
  template: `
    <nz-modal
      [(nzVisible)]="isVisible"
      nzTitle="User Form"
      (nzOnCancel)="handleCancel()"
      (nzOnOk)="submit()"
      [nzOkDisabled]="form.invalid"
      nzCancelText="Cancel"
      nzOkText="Update"
    >
      <form [formGroup]="form" (ngSubmit)="submit()" *nzModalContent>
        <nz-form-item>
          <nz-form-label [nzRequired]="true" nzFor="name">Name</nz-form-label>
          <nz-form-control>
            <input nz-input id="name" formControlName="name" />
            <input nz-input id="id" type="hidden" formControlName="id" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzRequired]="true" nzFor="email">Email</nz-form-label>
          <nz-form-control>
            <input nz-input id="email" formControlName="email" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>Role</nz-form-label>
          <nz-form-control [nzSpan]="14">
            <nz-select formControlName="role_id" nzPlaceHolder="Select Role">
              <nz-option [nzValue]="1" nzLabel="Developer"></nz-option>
              <nz-option [nzValue]="2" nzLabel="Manager"></nz-option>
              <nz-option [nzValue]="3" nzLabel="Programator"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>Status</nz-form-label>
          <nz-form-control [nzSpan]="14">
            <nz-select formControlName="status" nzPlaceHolder="Select Status">
              <nz-option [nzValue]="'Active'" nzLabel="Active"></nz-option>
              <nz-option [nzValue]="'Lock'" nzLabel="Lock"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-modal>
  `,
})
export class NzDemoModalAsyncComponent {
  @Output() updated = new EventEmitter<void>();
  isVisible = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private modal: NzModalService,
    // private modalRef: NzModalRef
  ) {
    this.form = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role_id: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  showModal(id: number): void {
    this.isVisible = true;
    this.userService.getUserId(id).subscribe((res: any) => {
      console.log(res.user.email);
      this.form.patchValue(res.user);
    });
  }

  submit(): void {
    if (this.form.valid) {
      const formData = { ...this.form.value };
      this.userService.update(formData, formData.id).subscribe({
        next: (res) => {
          if (res.status == 'success') {
            this.modal.success({
              nzTitle: 'Thành công',
              nzContent: res.message || 'Sửa thành công',
            });
            this.handleCancel();
            this.updated.emit();
          } else {
            this.modal.error({
              nzTitle: 'Thất bại',
              nzContent: res.message || 'Sửa thất bại',
            });
          }
        },
        error: (err) => {
          this.modal.error({
            nzTitle: 'Thất bại',
            nzContent: err || 'Sửa thất bại',
          });
        },
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.form.reset();
  }
}
