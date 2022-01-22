import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {  Observable, Subject } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userLogged = new Subject<User>();

    constructor(private http: HttpClient) {
    }

    getCurrentUser(): Observable<User> {
        return this.userLogged.asObservable();
    }

    setCurrentUser(user: User) {
        this.userLogged.next(user);
    }

    register(name: string, email:string, password: string) {
        return this.http.post("http://localhost:3000/users/", 
                          {"name": name, "email": email,"password": password, "folders": []}).subscribe();
    }

    login(email: string, password: string) {
        return this.http.post("http://localhost:3000/users/loggedUser/", {"email": email,"password": password}).subscribe((res: any) => {
            this.setCurrentUser(res.data);
        });
    }

    logout(id: string) {
        return this.http.put("http://localhost:3000/users/loggedUser/", id).subscribe(res => {

            this.setCurrentUser(null);
        });
    }
}