import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Film } from 'src/entities/film';
import { UsersService } from 'src/services/users.service';

export interface FilmsResponse{
  items: Film[]
  totalCount: number
}

@Injectable({
  providedIn: 'root'
})
export class FilmsService {

  url = this.usersService.url
  //token=this.usersService.token

  get token(){
    return this.usersService.token
  }

  constructor(private http: HttpClient, private usersService: UsersService) { }

  getHeader(){
    if(this.token){
      return {headers: {'X-Auth-Token': this.token}}
    }return undefined
  }

  getFilms():Observable<FilmsResponse>{
    return this.http.get<FilmsResponse>(this.url+'films', this.getHeader()).pipe(
      catchError(err=> this.usersService.processError(err)))
  }


}
