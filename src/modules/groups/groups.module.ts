import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupsMenuComponent } from './groups-menu/groups-menu.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { MaterialModule } from '../material.module';


@NgModule({
  declarations: [
    GroupsListComponent,
    GroupsMenuComponent,
    GroupDetailComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    GroupsRoutingModule
  ]
})
export class GroupsModule { }
