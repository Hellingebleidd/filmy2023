import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Group } from 'src/entities/group';
import { UsersService } from 'src/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class GroupResolverService implements Resolve<Group>{

  constructor(private usersService: UsersService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Group | Observable<Group> | Promise<Group> {
    //resolve bude zavolany tolkokrat kolko guard strazi takze aj pri zmene IDcka
    //hodi sa na filmy potom?

    const groupId = +(route.paramMap.get("id") || 0) //pretypujem na number
    // debugger;
    return this.usersService.getGroup(groupId)
    
  }
}
