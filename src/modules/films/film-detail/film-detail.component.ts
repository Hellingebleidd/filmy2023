import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css']
})
export class FilmDetailComponent implements OnInit{

  @Input() imdbId?: string

  url: string = environment.omdbApi_url
  movieData: any

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    const id = this.imdbId
    this.http.get(this.url+id).subscribe(data=>this.movieData=data)
  }

}
