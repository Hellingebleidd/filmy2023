import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { environment } from 'src/environment/environment';
import { FilmsService, omdbFilm } from '../films.service';
import { Clovek } from 'src/entities/clovek';
import { Postava } from 'src/entities/postava';

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css']
})
export class FilmDetailComponent implements OnChanges{


  @Input() imdbFilm?: omdbFilm
  @Input() rezia?: Clovek[]
  @Input() postavy?: Postava[]


  movieData?: omdbFilm
  reziser=''
  herci: string[] = []
  ludia?: Clovek[]
  obsadenie=''

  constructor(private http: HttpClient, private filmsService: FilmsService){}

  ngOnChanges(changes: SimpleChanges): void {
    this.movieData=this.imdbFilm

    if(this.rezia){
      this.rezia.map(r => this.reziser=r.krstneMeno+' ' + (r.stredneMeno? r.stredneMeno+' '+r.priezvisko : r.priezvisko))

    if(this.postavy){
      this.ludia= this.postavy.map(p => p.herec)
      this.herci = this.ludia.map(herec=>herec.krstneMeno+' ' + (herec.stredneMeno? herec.stredneMeno+' '+herec.priezvisko : herec.priezvisko))
      this.obsadenie = this.herci.join(', ')
    }
  }
  }

  // ngOnInit(): void {
  //   const id = this.imdbId
  //   this.http.get(this.url+id).subscribe(data=>this.movieData=data)
  // }

}
