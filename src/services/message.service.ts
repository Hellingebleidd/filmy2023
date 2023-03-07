import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  default_duration= 3000

  constructor(private snackBar: MatSnackBar) { }

  successMessage(msg:string, duration=this.default_duration){
    this.snackBar.open(msg, "SUCCESS", {duration: duration})
  }

  errorMessage(msg:string,duration=this.default_duration){
    this.snackBar.open(msg, "ERROR", {duration: duration})
  }
}
