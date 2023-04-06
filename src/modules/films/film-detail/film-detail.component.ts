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
  reziseri=''
  hlavnePostavy =''
  vedlajsiePostavy=''

  ngOnChanges(changes: SimpleChanges): void {
    this.movieData=this.imdbFilm

    if(this.rezia){
      this.reziseri = this.rezia.map(r=>r.krstneMeno+' ' + (r.stredneMeno? r.stredneMeno+' '+r.priezvisko : r.priezvisko))
                                .join(', ')

    if(this.postavy){
      this.hlavnePostavy = this.postavy.filter(postava=> postava.dolezitost ==='hlavná postava')
                                        .map(p=>(p.postava +' ( '+p.herec.krstneMeno+' '+ (p.herec.stredneMeno? p.herec.stredneMeno+' '+p.herec.priezvisko : p.herec.priezvisko)+' )'))
                                        .join(', ')

      this.vedlajsiePostavy = this.postavy.filter(postava=> postava.dolezitost ==='vedľajšia postava')
                                           .map(p=>(p.postava +' ( '+p.herec.krstneMeno+' '+ (p.herec.stredneMeno? p.herec.stredneMeno+' '+p.herec.priezvisko : p.herec.priezvisko)+' )'))
                                           .join(', ')
    }

  }
  }

  // ngOnInit(): void {
  //   const id = this.imdbId
  //   this.http.get(this.url+id).subscribe(data=>this.movieData=data)
  // }

}
