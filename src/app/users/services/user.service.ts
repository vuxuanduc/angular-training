import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user.model";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class UserService {

    constructor(private http: HttpClient) {};

    getAll(): Observable<User[]> {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getUserId(id: number): Observable<User> {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`)
    } 

    createUser(userData: User): Observable<any> {
        return this.http.post(`${environment.apiUrl}/users/create`, userData);
    }

    delete(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${environment.apiUrl}/users/delete/${id}`);
    }

    update(userData: User, id: number): Observable<any> {
        return this.http.put(`${environment.apiUrl}/users/update/${id}`, userData);
    }
}

