import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Auth } from 'src/entities/auth';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true;
  auth = new Auth("Peter","sovy")
  message=''

  constructor(private usersService:UsersService, private router: Router, private snackBar: MatSnackBar){}

  onSubmit(){
    this.usersService.login(this.auth).subscribe(success=>{
      if (success){
        //idem na extended users
        this.router.navigateByUrl('/extended-users')
      }else{
        //vypisem ze neprihlaseny -> zle heslo/login
        this.message="Zly login alebo heslo"
        // setTimeout(()=> this.message='', 3000)
        this.snackBar.open("Nespravne meno alebo heslo", "OK")
      }
    })
  }
}
