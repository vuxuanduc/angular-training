import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UserService } from '../../services/user.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { User } from '../../models/user.model';

@Component({
  selector: 'modal-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-label [nzRequired]="true" nzFor="name">Name</nz-form-label>
        <nz-form-control>
          <input nz-input id="name" formControlName="name" />
          <input type="hidden" nz-input id="id" formControlName="id" />
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

      <div class="text-right mt-4">
        <button nz-button nzType="primary" [disabled]="form.invalid">
          Create
        </button>
      </div>
    </form>
  `,
})
export class ModalFormComponent implements OnInit {
  dataUser!: User;
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private modal: NzModalService,
    private modalRef: NzModalRef
  ) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      status: ['', Validators.required],
      role_id: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    console.log(this.dataUser);
  }

  submit() {
    if (this.form.valid) {
      if (this.form.get('id')?.value == '') {
        const formData = { ...this.form.value };
        delete formData.id;
        this.userService.createUser(formData).subscribe({
          next: (res) => {
            if (res.status == 'success') {
              this.modal.success({
                nzTitle: 'Thành công',
                nzContent: res.message || 'Thêm thành công',
              });
              this.modalRef.close(true);
            } else {
              this.modal.error({
                nzTitle: 'Thất bại',
                nzContent: res.message || 'Thất bại',
              });
            }
          },
          error: (err) => {
            this.modal.error({
              nzTitle: 'Thất bại',
              nzContent: err,
            });
          },
        });
      }
    }
  }
}
