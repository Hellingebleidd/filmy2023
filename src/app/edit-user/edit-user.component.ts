import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, map, Observable, of, switchMap } from 'rxjs';
import { Group } from 'src/entities/group';
import { User } from 'src/entities/user';
import { CanDeactivateComponent } from 'src/guards/deactivate.guard';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit, CanDeactivateComponent {

  userId?: number;
  user?: User;
  hide = true;
  allGroups: Group[]=[]
  saved = false

  editForm = new FormGroup({
    name: new FormControl<string>('',{nonNullable:true,
                                      validators: [Validators.required],
                                      asyncValidators: this.userConflictValidator('name') }),
    email: new FormControl('', [Validators.required,
                                Validators.email,
                                Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$")],
                               this.userConflictValidator('email')),
    password: new FormControl(''),
    active: new FormControl<boolean>(false, {nonNullable:true}),
    groups: new FormArray([])
  })

  constructor(private route: ActivatedRoute, private usersService: UsersService, private router: Router) {}


  ngOnInit(): void {
    // this.userId = +this.route.snapshot.params['id'];
    // this.route.paramMap.subscribe(params => {
    //   this.userId = +(params.get("id") || "")
    //   if(this.userId)
    //   this.usersService.getUser(this.userId).subscribe(user => this.user=user )
    // })
    this.route.paramMap.pipe(
      switchMap(params => {
        if(params.has("id")){ //editing user
          this.userId = +(params.get("id") || '')
          if(this.userId){return this.usersService.getUser(this.userId)}
          else{return EMPTY}
        }else{ //new user
          return of(new User("","", undefined,undefined,"",true,[]))
        }
      })
    ).subscribe(u=>{
      this.user=u
      console.log(u);
      this.editForm.patchValue({
        name: u.name,
        email: u.email,
        active: u.active
      });
      this.usersService.getGroups().subscribe(groups=>{
        this.allGroups = groups
        this.groups.clear()
        for(let group of groups){
          if(this.user?.groups){
            const isMember = this.user.groups?.some(ug => ug.id === group.id);
//            const isMember = !!this.user.groups?.find(ug => ug.id === group.id);
            this.groups.push(new FormControl<boolean>(isMember));
          }
        }
      })
    })
  }

  userConflictValidator(field: 'name'|'email'): AsyncValidatorFn{
    return (control: AbstractControl):Observable<ValidationErrors | null> =>{
      const name = field === 'name' ? control.value : ''
      const email = field === 'email' ? control.value : ''
      const user = new User(name, email, this.user?.id)
      return this.usersService.userConflicts(user).pipe(
        map( arrayConflicts => {
          if(arrayConflicts.length === 0) return null
          return {serverConflict: field + ' already in use'}
        })
      )
    }
  }

  onSubmit(){
    const pass = this.password.value.trim() || undefined;
    const groups = this.allGroups.filter((_gr, i) => this.groups.at(i).value);
    const user = new User(this.name.value,
                          this.email.value,
                          this.user?.id,
                          undefined,
                          pass,
                          this.active.value,
                          groups);
    this.usersService.saveUser(user).subscribe(savedUser => {
      this.saved=true
      this.router.navigateByUrl("/extended-users")}
    );
  }

  get name(): FormControl<string> {
    return this.editForm.get('name') as FormControl<string>
  }
  get email(): FormControl<string> {
    return this.editForm.get('email') as FormControl<string>
  }
  get password(): FormControl<string> {
    return this.editForm.get('password') as FormControl<string>
  }
  get active(): FormControl<boolean> {
    return this.editForm.get('active') as FormControl<boolean>
  }
  get groups(): FormArray {
    return this.editForm.get('groups') as FormArray
  }

  canDeactivate():boolean | Observable<boolean>{
    if (this.saved) return true;
    if (this.user?.name !== this.name.value) return false;
    if (this.user?.email !== this.email.value) return false;
    if (this.user?.active !== this.active.value) return false;
    return true;

  }
}
