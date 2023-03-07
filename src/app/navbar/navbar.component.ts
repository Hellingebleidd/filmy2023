import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  loggedUser=''

  constructor(private usersService: UsersService){}

  ngOnInit(): void {
    this.usersService.getCurrentUsers$().subscribe(userName=>this.loggedUser=userName)
  }

  logout(){
    this.usersService.logout()
  }
}
