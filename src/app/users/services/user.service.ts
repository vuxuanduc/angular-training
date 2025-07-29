import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user.model";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private api = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) {};

    getAll(): Observable<User[]> {
        return this.http.get<User[]>(this.api);
    }

    delete(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${environment.apiUrl}/users/delete/${id}`);
    }
}

