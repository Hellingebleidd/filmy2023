import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupsMenuComponent } from './groups-menu/groups-menu.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { MaterialModule } from '../material.module';
import { GroupEditChildComponent } from './group-edit-child/group-edit-child.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GroupsListComponent,
    GroupsMenuComponent,
    GroupDetailComponent,
    GroupEditChildComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    GroupsRoutingModule
  ]
})
export class GroupsModule { }
