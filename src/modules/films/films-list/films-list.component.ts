import { Component, OnInit } from '@angular/core';
import { Film } from 'src/entities/film';
import { UsersService } from 'src/services/users.service';
import { FilmsService } from '../films.service';

@Component({
  selector: 'app-films-list',
  templateUrl: './films-list.component.html',
  styleUrls: ['./films-list.component.css']
})
export class FilmsListComponent implements OnInit{
 
  columnsToDisplay = ['id','nazov','rok']
  films: Film[]=[]

  constructor(private filmsService: FilmsService, private usersService: UsersService){}

  ngOnInit(): void {
    if (this.usersService.isLoggedIn()){
      this.columnsToDisplay = ['id','nazov','SKnazov','rok', 'AFI98', 'AFI07']
    }
    this.filmsService.getFilms().subscribe(r => {
      this.films=r.items
      console.log(r);
      
    })
  }

  onFilter(event: any){

  }
}
