import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';
import {MatPaginator } from '@angular/material/paginator'
import { GroupsToStringPipe } from 'src/pipes/groups-to-string.pipe';

@Component({
  selector: 'app-extended-users',
  templateUrl: './extended-users.component.html',
  styleUrls: ['./extended-users.component.css'],
})
export class ExtendedUsersComponent implements OnInit, AfterViewInit {
  columnsToDisplay = ['id', 'name', 'email', 'lastLogin', 'active', 'groups','perms'];

  users: User[] = [];

  usersDataSource = new MatTableDataSource<User>()

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    // this.usersService.getExtendedUsers().subscribe((u) => (this.users = u));
    this.usersService.getExtendedUsers().subscribe(users =>this.usersDataSource.data = users)
  }

  ngAfterViewInit(): void {
    if(this.paginator && this.sort){
      this.usersDataSource.paginator=this.paginator
      this.usersDataSource.sort=this.sort
      const pipe: GroupsToStringPipe = new GroupsToStringPipe()
      this.usersDataSource.sortingDataAccessor=(user: User, colName: string): string | number=>{
        switch(colName){
          case 'groups':
            return user.groups?.length || 0
          case 'perms':
            return pipe.transform(user.groups || [], "perms")
          default:
            return user[colName as keyof User]?.toString() || ''
        }
      }
    }
  }
}
