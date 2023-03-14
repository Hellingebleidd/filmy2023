import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from 'src/register/register.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { LoginComponent } from './login/login.component';
import { Page404Component } from './page404/page404.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {path: "users", component: UsersComponent},
  {path: "extended-users", component: ExtendedUsersComponent},
  {path: "user/edit/:id", component: EditUserComponent},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "", redirectTo: "users", pathMatch: "full"},
  {path: "**", component: Page404Component}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
