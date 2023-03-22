import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupResolverService } from 'src/guards/group-resolver.service';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupsMenuComponent } from './groups-menu/groups-menu.component';

const routes: Routes = [
  {
    path: 'groups',
    component: GroupsMenuComponent,
    children: [
      { path: '', component: GroupsListComponent },
      { path: 'detail/:id', component: GroupDetailComponent, resolve: { group: GroupResolverService } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsRoutingModule {}