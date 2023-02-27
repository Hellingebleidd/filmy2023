import { Injectable } from '@angular/core';
import { User } from 'src/entities/user';
import { map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url = 'http://localhost:8080/';

  users: User[] = [
    new User('AlicaService','alica@alica.sk'),
    new User('BobService', 'bobik@kubik.sk', 1, new Date(),'tajne')];

  constructor(private http: HttpClient) { }

  getLocalUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + 'users').pipe(
      map(jsonObj => jsonObj.map(jsonUser => User.clone(jsonUser)))
    );
  }
}
