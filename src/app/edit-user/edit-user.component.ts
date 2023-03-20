import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, map, Observable, switchMap } from 'rxjs';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {

  userId?: number;
  user?: User;
  hide = true;

  editForm = new FormGroup({
    name: new FormControl<string>('',{nonNullable:true, 
                                      validators: [Validators.required],
                                      asyncValidators: this.userConflictValidator('name') }),
    email: new FormControl('', [Validators.required, 
                                Validators.email,
                                Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$")],
                               this.userConflictValidator('email')),
    password: new FormControl('')
  })

  constructor(private route: ActivatedRoute, private usersService: UsersService) {}

  ngOnInit(): void {
    // this.userId = +this.route.snapshot.params['id'];
    // this.route.paramMap.subscribe(params => {
    //   this.userId = +(params.get("id") || "")
    //   if(this.userId)
    //   this.usersService.getUser(this.userId).subscribe(user => this.user=user )
    // })
    this.route.paramMap.pipe(
      switchMap(params => {
        this.userId = +(params.get("id") || '')
        if(this.userId){return this.usersService.getUser(this.userId)}
        else{return EMPTY}
      })
    ).subscribe(u=>this.user=u)
  }

  userConflictValidator(field: 'name'|'email'): AsyncValidatorFn{
    return (control: AbstractControl):Observable<ValidationErrors | null> =>{
      const name = field === 'name' ? control.value : ''
      const email = field === 'email' ? control.value : ''
      const user = new User(name, email)
      return this.usersService.userConflicts(user).pipe(
        map( arrayConflicts => {
          if(arrayConflicts.length === 0) return null
          return {serverConflict: field + ' already in use'}
        })
      )
    }
  }

  onSubmit(){}

  get name(): FormControl<string> {
    return this.editForm.get('name') as FormControl<string>
  }
  get email(): FormControl<string> {
    return this.editForm.get('email') as FormControl<string>
  }
  get password(): FormControl<string> {
    return this.editForm.get('password') as FormControl<string>
  }

}
