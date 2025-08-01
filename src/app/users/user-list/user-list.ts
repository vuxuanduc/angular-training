import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ModalFormComponent } from './modal-form-add/modal-form-add';
@Component({
  standalone: true,
  selector: 'app-user-list',
  imports: [
    CommonModule,
    NzTableModule,
    NzTagModule,
    NzIconModule,
    ModalFormComponent,
  ],
  providers: [NzModalService],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
  users: User[] = [];
  constructor(
    private userService: UserService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe((res) => {
      this.users = res;
    });
  }

  openFormModal(id?: number): void {
    const modalRef = this.modal.create({
      nzTitle: 'Create User',
      nzContent: ModalFormComponent,
      nzFooter: null,
      nzWidth: 600,
    });
    if (id != undefined) {
      this.userService.getUserId(id).subscribe((res) => {
        const actuaUser = (res as any).user;
        if (modalRef.componentInstance) {
          modalRef.componentInstance.dataUser = actuaUser;
          console.log(actuaUser);
        }
      });
    }
    modalRef.afterClose.subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  onDelete(id: number) {
    this.modal.confirm({
      nzTitle: 'Xác nhận xóa?',
      nzContent: 'Bạn có chắc chắn muốn xóa mục này?',
      nzOkText: 'Xóa',
      nzOkDanger: true,
      nzCancelText: 'Hủy',
      nzOnOk: async () => {
        try {
          const res = await this.delete(id);
          if (res.status == 'success') {
            this.modal.success({
              nzTitle: 'Thành công',
              nzContent: res.message || 'Xóa thành công',
            });
          } else {
            this.modal.error({
              nzTitle: 'Thất bại',
              nzContent: res.message || 'Xóa thất bại',
            });
          }
        } catch (err) {
          const error = err as Error;
          this.modal.error({
            nzTitle: 'Thất bại',
            nzContent: error.message || 'Xóa thất bại!',
          });
        }
      },
    });
  }

  delete(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.delete(id).subscribe({
        next: (res: any) => {
          if (res.status == 'success') {
            this.users = this.users.filter((u) => u.id != id);
          }
          resolve(res);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
}
