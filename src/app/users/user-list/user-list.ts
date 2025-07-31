import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  providers: [NzModalService],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList implements OnInit{
  users: User[] = [];

  constructor(
    private userService: UserService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
      this.userService.getAll().subscribe((res) => {
        this.users = res
      })
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
          if(res.status == 'success') {
            this.modal.success({
              nzTitle: 'Thành công',
              nzContent: res.message || 'Xóa thành công'
            });
          }else {
            this.modal.error({
              nzTitle: 'Thất bại',
              nzContent: res.message || 'Xóa thất bại'
            });
          }
        } catch(err) {
          const error = err as Error;
          this.modal.error({
            nzTitle: 'Thất bại',
            nzContent: error.message || 'Xóa thất bại!'
          });
        }
      }
    });
  }

  delete(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.delete(id).subscribe({
        next: (res: any) => {
          if(res.status == 'success') {
            this.users = this.users.filter(u => u.id != id);
          }
          resolve(res);
        },
        error: (err) => {
          reject(err);
        }
      })
    })
  }
  showModal = false;

  deactivate() {
    this.showModal = false;
  }

}
