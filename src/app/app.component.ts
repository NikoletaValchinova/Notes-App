import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { User } from './models/user.model';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  loggedUser: User;

  constructor(
      private router: Router,
      private authenticationService: AuthenticationService,
      private readonly http: HttpClient
  ) {

      this.http.get<User>("http://localhost:3000/users/loggedUser/").subscribe(user => 
      {
        this.loggedUser = user;
      });
  }

  ngOnInit() {

    this.http.get<User>("http://localhost:3000/users/loggedUser/").subscribe(user => this.loggedUser = user);
   }

  logout() {
      this.loggedUser = null;
      this.router.navigate(['login']);
  }
}