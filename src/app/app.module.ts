import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { Page404Component } from './page404/page404.component';
import { FormsModule } from '@angular/forms';
import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { MaterialModule } from 'src/modules/material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { GroupsToStringPipe } from 'src/pipes/groups-to-string.pipe';
import { RegisterComponent } from '../register/register.component';



@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    LoginComponent,
    Page404Component,
    ExtendedUsersComponent,
    NavbarComponent,
    GroupsToStringPipe,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
