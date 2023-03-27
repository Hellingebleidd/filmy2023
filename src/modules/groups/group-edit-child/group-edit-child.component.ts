import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Group } from 'src/entities/group';

@Component({
  selector: 'app-group-edit-child',
  templateUrl: './group-edit-child.component.html',
  styleUrls: ['./group-edit-child.component.css']
})
export class GroupEditChildComponent implements OnChanges{
 
  @Input() group?: Group  //na vstupe dostane group z rodica
  //ked chcem aby sa premenna v rodicovy volala inak ako tu tak ju napisem do zatvorky v inpute

  @Output() save = new EventEmitter<Group>()

  name=''
  permString =''

  ngOnChanges(changes: SimpleChanges): void { //zavola sa vzdy ked sa zmeni input
    this.name=this.group?.name || ''
    this.permString = this.group?.permissions.join(', ') || ''
  }

  onSubmit(){
    const perms = this.permString.split(',').map(p => p.trim()).filter(p=> p) // p !== '' (lebo '' je falsy)
    const newGroup = new Group(this.name, perms, this.group?.id)
    this.save.emit(newGroup)
  }
}
