import { Component, OnInit } from '@angular/core';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-extended-users',
  templateUrl: './extended-users.component.html',
  styleUrls: ['./extended-users.component.css'],
})
export class ExtendedUsersComponent implements OnInit {
  columnsToDisplay = ['id', 'name', 'email', 'lastLogin', 'active', 'groups'];

  users: User[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.usersService.getExtendedUsers().subscribe((u) => (this.users = u));
  }
}
