import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilmsRoutingModule } from './films-routing.module';
import { FilmsListComponent } from './films-list/films-list.component';
import { MaterialModule } from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { FilmDetailComponent } from './film-detail/film-detail.component';


@NgModule({
  declarations: [
    FilmsListComponent,
    FilmDetailComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FilmsRoutingModule
  ]
})
export class FilmsModule { }
