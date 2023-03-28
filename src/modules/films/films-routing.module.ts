import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilmsListComponent } from './films-list/films-list.component';

const routes: Routes = [
  // {path: 'films', component: FilmsListComponent} -> staticky sposob, natiahne ho hned
  {path:'', component: FilmsListComponent}  // dynamicky s prazdnym stringom v pathe a v app.routing si pomocou loadchlidren natiahnem
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmsRoutingModule { }
