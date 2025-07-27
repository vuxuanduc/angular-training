import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";


@Component({
    selector: 'user-list',
    templateUrl: './user-list.html',
    styleUrl: './user-list.scss',
    standalone: false,
})

export class UserListComponent {
    constructor(
        private titleService: Title
    ){}
    ngOnInit(): void {
        this.titleService.setTitle('Danh sách người dùng')
    }
}