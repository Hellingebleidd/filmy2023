import { Injectable } from '@angular/core';
import { User } from 'src/entities/user';
import { catchError, EMPTY, map, Observable, of, } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Auth } from 'src/entities/auth';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url = 'http://localhost:8080/';

  users: User[] = [
    new User('AlicaService','alica@alica.sk'),
    new User('BobService', 'bobik@kubik.sk', 1, new Date(),'tajne')];

  token='';

  constructor(private http: HttpClient, private msgService: MessageService) { }

  getLocalUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + 'users').pipe(
      map(jsonObj => jsonObj.map(jsonUser => User.clone(jsonUser))),
      catchError(err=> this.processError(err))
    );
  }

  getExtendedUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + 'users/'+this.token).pipe(
      map(jsonObj => jsonObj.map(jsonUser => User.clone(jsonUser))),
      catchError(error=>this.processError(error))
    );
  }

  login(auth:Auth):Observable<boolean>{
    return this.http.post(this.url+'login',auth, {responseType: "text"}).pipe(
      map(token =>{
        this.token=token
        return true
      }),
      catchError(error=>this.processError(error))
    )
  }

  processError(error:any):Observable<never>{
    if(error instanceof HttpErrorResponse){
      if(error.status===0){
        //server nedostupny, neodpoveda
        this.msgService.errorMessage("server not available")
      }
      if(error.status>=400 && error.status<500){
        const msg = error.error.errorMessage || JSON.parse(error.error).errorMessage
        this.msgService.errorMessage(msg)
      }
      if(error.status>=500){
        this.msgService.errorMessage("server crashed, call web support")
        console.log(error);
        
      }
    }
    return EMPTY
  }
}
