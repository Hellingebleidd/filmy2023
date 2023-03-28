import { Injectable } from '@angular/core';
import { User } from 'src/entities/user';
import { catchError, defaultIfEmpty, EMPTY, map, Observable, of, Subscriber, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Auth } from 'src/entities/auth';
import { MessageService } from './message.service';
import { Router } from '@angular/router';
import { Group } from 'src/entities/group';

const DEFAULT_NAVIGATE_AFTER_LOGIN = '/extended-users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  navigateAfterLogin = DEFAULT_NAVIGATE_AFTER_LOGIN;
  url = 'http://localhost:8080/';

  users: User[] = [
    new User('AlicaService', 'alica@alica.sk'),
    new User('BobService', 'bobik@kubik.sk', 1, new Date(), 'tajne'),
  ];

  userSubscriber?: Subscriber<string>;

  // token='';

  constructor(
    private http: HttpClient,
    private msgService: MessageService,
    private router: Router
  ) {}

  private set token(value: string) {
    if (value) {
      localStorage.setItem('filmsToken', value);
    } else {
      localStorage.removeItem('filmsToken');
    }
  }

  public get token(): string {
    const value = localStorage.getItem('filmsToken');
    return value || '';
  }

  private set username(value: string) {
    this.userSubscriber?.next(value);
    if (value) {
      localStorage.setItem('filmsUsername', value);
    } else {
      localStorage.removeItem('filmsUsername');
    }
  }

  private get username(): string {
    const value = localStorage.getItem('filmsUsername');
    return value || '';
  }

  getCurrentUsers$(): Observable<string> {
    return new Observable((subscriber) => {
      this.userSubscriber = subscriber;
      subscriber.next(this.username);
    });
  }

  getLocalUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + 'users').pipe(
      map((jsonObj) => jsonObj.map((jsonUser) => User.clone(jsonUser))),
      catchError((err) => this.processError(err))
    );
  }

  getExtendedUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + 'users/' + this.token).pipe(
      map((jsonObj) => jsonObj.map((jsonUser) => User.clone(jsonUser))),
      catchError((error) => this.processError(error))
    );
  }

  login(auth: Auth): Observable<boolean> {
    return this.http
      .post(this.url + 'login', auth, { responseType: 'text' })
      .pipe(
        map((token) => {
          this.token = token;
          this.username = auth.name;
          this.msgService.successMessage(
            'user ' + auth.name + ' successfully logged in'
          );
          return true;
        }),
        catchError((error) => this.processError(error))
      );
  }

  logout() {
    this.http
      .get(this.url + 'logout/' + this.token)
      .pipe(catchError((error) => this.processError(error)))
      .subscribe(() => {
        this.navigateAfterLogin = DEFAULT_NAVIGATE_AFTER_LOGIN;
        this.token = '';
        this.username = '';
        this.router.navigateByUrl('/login');
      });
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.url + 'register', user).pipe(
      tap((u) => {
        this.msgService.successMessage(
          'User ' + u.name + ' successfully registered, please login'
        );
        this.router.navigateByUrl('/login');
      }),

    );
  }

  userConflicts(user:User): Observable<string[]>{
    return this.http.post<string[]>(this.url+'user-conflicts', user).pipe(
      catchError((error) => this.processError(error))
    )
  }

  deleteUser(userId: number): Observable <boolean>{
    return this.http.delete(this.url + 'user/'+userId+'/'+this.token).pipe(
      map(()=> true),
      catchError((error) => this.processError(error))
    )
  }

  getUser(userId: number):Observable<User>{
    return this.http.get<User>(this.url + 'user/'+userId+'/' + this.token).pipe(
      map(jsonUser => User.clone((jsonUser)),
      catchError((error) => this.processError(error))
    ))
  }

  saveUser(user:User): Observable<User> {
    return this.http.post<User>(this.url + 'users/' + this.token, user).pipe(
      map(jsonUser => User.clone(jsonUser)),
      tap(user => this.msgService.successMessage("User " + user.name + " saved on server")),
      catchError(error => this.processError(error))
    );
  }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.url + 'groups').pipe(
      map(jsonGroups => jsonGroups.map(g => Group.clone(g))),
      catchError(error => this.processError(error))
    )
  }
  getGroup(id:number): Observable<Group> {
    return this.http.get<Group>(this.url + 'group/'+id).pipe(
      map(g => Group.clone(g)),
      catchError(error => this.processError(error)
    ))
  }

  saveGroup(group: Group):Observable<Group>{
    return this.http.post<Group>(this.url+'groups/'+this.token, group).pipe(
      map(g => Group.clone(g)),
      catchError(error => this.processError(error))
      )
  }

  checkToken(): Observable<boolean>{
    if (! this.token)
      return of(false);
    return this.http.get(this.url + 'check-token/' + this.token).pipe(
      catchError(error => this.processError(error)),
      defaultIfEmpty(false),
      map(val => val !== false)
    )
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  isLoggedInAsync(): Observable<boolean> {
    return this.checkToken();
  }


  processError(error: any): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        //server nedostupny, neodpoveda
        this.msgService.errorMessage('server not available');
      }
      if (error.status >= 400 && error.status < 500) {
        const msg = error.error.errorMessage || JSON.parse(error.error).errorMessage;
        if (error.status === 401 && msg === 'unknown token') {
          this.logout();
          this.msgService.errorMessage('Session expired, please log in again.');
          return EMPTY;
        }

        this.msgService.errorMessage(msg);
      }
      if (error.status >= 500) {
        this.msgService.errorMessage('server crashed, call web support');
        console.log(error);
      }
    }
    return EMPTY;
  }
}
