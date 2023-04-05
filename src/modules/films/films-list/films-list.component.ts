import { DataSource } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { mergeAll, Observable, Subject, switchMap, tap, map, of } from 'rxjs';
import { Film } from 'src/entities/film';
import { UsersService } from 'src/services/users.service';
import { FilmsService, omdbFilm } from '../films.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-films-list',
  templateUrl: './films-list.component.html',
  styleUrls: ['./films-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FilmsListComponent implements OnInit, AfterViewInit{

  columnsToDisplay = ['id','nazov','rok']
  films: Film[]=[]
  filmsDataSource: FilmsDataSource
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  filterEmitter = new EventEmitter<string>()

  expandedElement: any //omdbFilm | undefined
  movieData: any

  constructor(private filmsService: FilmsService, private usersService: UsersService){
    this.filmsDataSource=new FilmsDataSource(filmsService)
  }

  ngOnInit(): void {
    if (this.usersService.isLoggedIn()){
      this.columnsToDisplay = ['id','nazov','SKnazov','rok', 'AFI98', 'AFI07']
    }
    this.filmsService.getFilms().subscribe(r => {
      this.films=r.items
      console.log('response: ', r);
    })
  }

  ngAfterViewInit(): void {
    //zavolam paginator aj sortovac
    if(this.paginator && this.sort){
          this.filmsDataSource.addEventsSources(this.paginator, this.sort, this.filterEmitter.asObservable())
        }
  }

  onFilter(event: any){
    this.filterEmitter.emit(event.target.value.trim().toLowerCase())
  }
}

//potrebujem dataSource pre tabulku, vyrobim si tu novu triedu
class FilmsDataSource implements DataSource<Film>{

  futureObservables = new Subject<Observable<Query>>() //subject je horuca rura
  //studena rura zacne vhadzovat data az ked niekto urobi subscribe. inak zaciatok rury nevznikne. ocakava sa ze studenu ruru bude pocuvat jeden. ak chcu dvaja kazdy ma novu ruru
  //horuca rura funguje tak ze ja otvorim ruru a nezaujima ma ci dakto pocuva abo ne, proste tam hadzem veci. mozu pocuvat aj 20(vtedy sa robi broadcast) aj nikto to je jedno

  paginator?: MatPaginator
  orderBy?: string
  descending?: boolean
  search?: string
  pageSize = 10
  constructor(private filsService: FilmsService){}

  addEventsSources(paginator: MatPaginator, sort: MatSort, filter: Observable<string>){
    //paginator.page je to co mi generuje prud eventov
    this.paginator = paginator
    this.pageSize = paginator.pageSize
    this.futureObservables.next(of(new Query(undefined,undefined,0,this.pageSize))) //first query
    this.futureObservables.next(paginator.page.pipe(
      map(pageEvent =>{
        this.pageSize = pageEvent.pageSize
        const indexFrom = pageEvent.pageIndex*pageEvent.pageSize
        const indexTo = indexFrom+pageEvent.pageSize
        return new Query(this.orderBy, this.descending, indexFrom, indexTo, this.search)
      })
    ))
    this.futureObservables.next(sort.sortChange.pipe(
      map(sortEvent =>{
        if(sortEvent.direction == ''){
          this.orderBy = undefined
          this.descending = undefined
          return new Query()
        }
        this.descending = sortEvent.direction === 'desc'
        this.orderBy = sortEvent.active
        if(sortEvent.active === 'AFI98') this.orderBy = 'poradieVRebricku.AFI 1998'
        if(sortEvent.active === 'AFI07') this.orderBy = 'poradieVRebricku.AFI 2007'
        return new Query(this.orderBy,this.descending,0,this.pageSize,this.search)
      })
    ))
    this.futureObservables.next(filter.pipe(
      tap( event => this.search = event),
      map(event => new Query(this.orderBy, this.descending, 0, this.pageSize, event))
    ))
  }

  connect(): Observable<Film[]> {
    return this.futureObservables.pipe(
      mergeAll(),
      tap(event => console.log('event z futureObservables rury: ', event)),
      switchMap(query => this.filsService.getFilms(query.orderBy,query.descending, query.indexFrom, query.indexTo, query.search)),
      map(response => {
        if(this.paginator)
                this.paginator.length = response.totalCount
        return response.items})
    )
  }
  disconnect(){}
}

//pomocny objekt ktory budem mapovat vonku zakazdym
class Query{
  constructor(
    public orderBy?: string,
    public descending?: boolean,
    public indexFrom = 0,
    public indexTo = 10,
    public search?: string
    ){}
}
