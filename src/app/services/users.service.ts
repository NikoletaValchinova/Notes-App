import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { NotesService } from './notes.service';


@Injectable({ providedIn: 'root' })
export class UserService {

    loggedUser: User;

    constructor(private http: HttpClient, private readonly notesService: NotesService) { }

    getAllUsers() {
        return this.http.get<User[]>('http://localhost:3000/users');
    }

    setLoggedUser(userId: string) {
        return this.http.post('http://localhost:3000/users', userId);
    }

    getLoggedUser() {
        return this.http.get<User>('http://localhost:3000/users').subscribe((res:any) => {
            this.loggedUser = res.data;
        });
    }
}
