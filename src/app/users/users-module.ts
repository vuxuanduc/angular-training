import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Users } from './users';
import { UserList } from './user-list/user-list';

const routes: Routes = [
  {
    path: '', component:Users,
    children: [{
      path: '', component: UserList
    }]
  }
]

@NgModule({
  declarations: [Users],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ], exports: [RouterModule],
})
export class UsersModule { }
