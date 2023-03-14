import { Component, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';
import * as zxcvbn from 'zxcvbn'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  hide = true;
  // toto tu je namiesto konstruktoru
  usersService = inject(UsersService);

  pswdMessage=''

  //sipkova funkcia sa spracuje ako posledna, preto ju musim uviest PRED miestom kde ju pouzivam
  pswdValidator=(control: AbstractControl):ValidationErrors|null =>{
    const pswd = control.value
    const res = zxcvbn(pswd)
    this.pswdMessage = 'password strength: '+res.score + '/4, crackable in '+res.crack_times_display.offline_slow_hashing_1e4_per_second
    return res.score <3 ? {'weakPassword': this.pswdMessage} : null
  }

  registerForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
      asyncValidators: this.userConflictValidator('name')
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$")],
      asyncValidators: this.userConflictValidator('email')
    }),
    password: new FormControl('', this.pswdValidator),
    password2: new FormControl(''),
  }, this.passwordsMatchValidator);

  get name(): FormControl<string> {
    return this.registerForm.get('name') as FormControl<string>;
  }
  get email(): FormControl<string> {
    return this.registerForm.get('email') as FormControl<string>;
  }
  get password(): FormControl<string> {
    return this.registerForm.get('password') as FormControl<string>;
  }
  get password2(): FormControl<string> {
    return this.registerForm.get('password2') as FormControl<string>;
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null{
    //teraz skusam normalnu a nie sipkovu funkciu jak tam hore
    const passwordModel = control.get('password') //toto je ten formcontrol co je vyssie
    const password2Model = control.get('password2') 
    if(passwordModel?.value===password2Model?.value){
      password2Model?.setErrors(null)
      return null
    }else{
      const err = {'diffPasswords': 'passwords do not match'}
      password2Model?.setErrors(err)
      return err
    }
  }

  //parametricky validator urobime -> vracia validator ktory nie je uz parametricky
  userConflictValidator(field: 'name' | 'email'): AsyncValidatorFn{ //string ktory ma dve povolene hodnoty
    //vraciame funkciu s normalnym validatorom
    return (control:AbstractControl): Observable<ValidationErrors | null> =>{
      const name = field==='name' ? control.value : ''
      const email = field==='email' ? control.value : ''

      const user= new User(name, email);

      return this.usersService.userConflicts(user).pipe(
        map( arrayConflicts => {
          if(arrayConflicts.length===0) return null;
          return { serverConflict: field + ' already used'}
        })
      )
    }
  }

  // stringify(error:any): string{
  //   return JSON.stringify(error)
  // }

  onSubmit() {
    const newUser = new User(
      this.name.value,
      this.email.value,
      undefined,
      undefined,
      this.password.value
    );
    this.usersService.register(newUser).subscribe();
  }

  printError(fc: FormControl){
    return JSON.stringify(fc.errors)
  }


}
