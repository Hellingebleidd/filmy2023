import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Film } from 'src/entities/film';
import { UsersService } from 'src/services/users.service';

export interface FilmsResponse {
  items: Film[];
  totalCount: number;
}

export interface omdbFilm{
  Title: string,
  Year: string,
  Runtime: string,
  Genre: string,
  Director: string,
  Actors: string,
  Plot: string,
  Poster: string,
  Language: string
}

@Injectable({
  providedIn: 'root',
})
export class FilmsService {
  url = this.usersService.url;
  //token=this.usersService.token

  get token() {
    return this.usersService.token;
  }

  constructor(private http: HttpClient, private usersService: UsersService) {}

  getOmdbFilm(url: string){
    return this.http.get<omdbFilm>(url).pipe(
      catchError((err) => this.usersService.processError(err)));
  }

  getHeader() {
    if (this.token) {
      return { headers: { 'X-Auth-Token': this.token } };
    }
    return undefined;
  }

  //parametre na sortenie a pod. robim na strane servera teraz
  getFilms(
    orderBy?: string,
    descending?: boolean,
    indexFrom?: number,
    indexTo?: number,
    search?: string): Observable<FilmsResponse> {

    //toto cele by mohlo byt aj navratvy typ tej funkcie getHeaders
    let options: { headers?: { [header: string]: string }; params?: HttpParams } | undefined = this.getHeader();

    if (orderBy || descending || indexFrom || indexTo || search) {
      //chcem mat params
      options = { ...(options || {}), params: new HttpParams() };

      if (orderBy) {options.params = options.params?.set('orderBy', orderBy);} //nemeni params ale vrati novy objek a ten povodny necha nezmeneny
      if (descending) {options.params = options.params?.set('descending', descending);}
      if (indexFrom) {options.params = options.params?.set('indexFrom', indexFrom);}
      if (indexTo) {options.params = options.params?.set('indexTo', indexTo);}
      if (search) {options.params = options.params?.set('search', search);}
    }

    return this.http.get<FilmsResponse>(this.url + 'films', options).pipe(
      catchError((err) => this.usersService.processError(err)));
  }
}
