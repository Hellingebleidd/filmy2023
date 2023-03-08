import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  hide = true;
  // toto tu je namiesto konstruktoru
  usersService = inject(UsersService);

  registerForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl<string>('', { nonNullable: true }),
    password: new FormControl(''),
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
}
