import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css']
})
export class FilmDetailComponent implements OnChanges{

  @Input() imdbId?: string

  url: string = environment.omdbApi_url
  movieData: any
  id=''

  constructor(private http: HttpClient){}

  ngOnChanges(changes: SimpleChanges): void {
    this.id=this.imdbId || ''
    if(this.id) this.http.get(this.url+this.id).subscribe(data=>this.movieData=data)
  }

  // ngOnInit(): void {
  //   const id = this.imdbId
  //   this.http.get(this.url+id).subscribe(data=>this.movieData=data)
  // }

}
