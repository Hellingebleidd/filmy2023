import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$")],
    }),
    password: new FormControl('', this.pswdValidator),
    password2: new FormControl(''),
  });

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
    return this.registerForm.get('password') as FormControl<string>;
  }

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
