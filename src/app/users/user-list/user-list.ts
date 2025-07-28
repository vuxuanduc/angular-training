import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList implements OnInit{
  users: User[] = [];
  constructor(private userService: UserService) {}

  ngOnInit(): void {
      this.userService.getAll().subscribe((res) => {
        this.users = res
      })
  }
}
