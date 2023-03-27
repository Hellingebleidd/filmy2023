import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/entities/group';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit{

  group?:Group

  constructor(private route: ActivatedRoute, private usersService: UsersService){}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data['group']){
        this.group = data['group'] //urcite tu bude skupina inak by resolver neotvoril komponent
      }
    })
  }

  onSave(groupToSave: Group){
    this.usersService.saveGroup(groupToSave).subscribe(saved => this.group = saved)
  }

}
