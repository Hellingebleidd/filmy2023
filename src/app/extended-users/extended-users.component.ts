import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';
import { MatPaginator } from '@angular/material/paginator';
import { GroupsToStringPipe } from 'src/pipes/groups-to-string.pipe';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-extended-users',
  templateUrl: './extended-users.component.html',
  styleUrls: ['./extended-users.component.css'],
})
export class ExtendedUsersComponent implements OnInit, AfterViewInit {
  columnsToDisplay = [
    'id',
    'name',
    'email',
    'lastLogin',
    'active',
    'groups',
    'perms',
    'buttons',
  ];

  users: User[] = [];

  usersDataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(private usersService: UsersService, public dialog: MatDialog) {}

  ngOnInit(): void {
    // this.usersService.getExtendedUsers().subscribe((u) => (this.users = u));
    this.usersService
      .getExtendedUsers()
      .subscribe((users) => (this.usersDataSource.data = users));
  }

  ngAfterViewInit(): void {
    if (this.paginator && this.sort) {
      this.usersDataSource.paginator = this.paginator;
      this.usersDataSource.sort = this.sort;
      const pipe: GroupsToStringPipe = new GroupsToStringPipe();
      this.usersDataSource.sortingDataAccessor = (
        user: User,
        colName: string
      ): string | number => {
        switch (colName) {
          case 'groups':
            return user.groups?.length || 0;
          case 'perms':
            return pipe.transform(user.groups || [], 'perms');
          default:
            return user[colName as keyof User]?.toString() || '';
        }
      };
      this.usersDataSource.filterPredicate = (
        user: User,
        filter: string
      ): boolean => {
        if (user.name.toLowerCase().includes(filter)) return true;
        if (user.email.toLowerCase().includes(filter)) return true;
        if (user.groups?.some((g) => g.name.toLowerCase().includes(filter)))
          return true;
        if (
          user.groups
            ?.flatMap((g) => g.permissions)
            .some((p) => p.toLowerCase().includes(filter))
        )
          return true;
        return false;
      };
    }
  }

  onFilter(event: any) {
    const filterText = event.target.value.trim().toLowerCase();
    this.usersDataSource.filter = filterText;
    this.usersDataSource.paginator?.firstPage();
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogData(
        'Deleting user',
        'Are you sure you want to permanently delete user ' +
          user.name +' ? This action is irreversible'
      ),
    });
    dialogRef.afterClosed().subscribe(decision =>{
      if(decision){
        this.usersService.deleteUser(user.id || 0).subscribe((success) => {
          if (success) {
            this.ngOnInit();
          }
        });
      }
    })
    
  }
}
