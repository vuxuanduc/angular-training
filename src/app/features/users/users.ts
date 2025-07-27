import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserListComponent } from "./components/user-list/user-list";
import { UsersRoutingModule } from "./users-routing"; 

@NgModule({
    declarations: [
        UserListComponent,
    ],
    imports: [
        CommonModule,
        UsersRoutingModule
    ]
})

export class UsersModule {}