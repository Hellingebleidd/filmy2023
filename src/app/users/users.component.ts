import { Component, OnInit } from '@angular/core';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [
    new User('Alica','alica@alica.sk'),
    new User('Bob', 'bobik@kubik.sk', 1, new Date(),'tajne'),
    {name:'Cyril', email:'cylinder@post.sk', password:'cyriloveHeslo',active: undefined, groups:[],
     toString: () => 'name: Cyril' }];
  activeUser?: User;
  columnsToDisplay = ['id','name','email'];
  errorText = '';

  constructor(private usersService: UsersService){}

  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next: users => this.users = users
    });
  }

  onUserClick(user: User) {
    this.activeUser = user;
  }
}
