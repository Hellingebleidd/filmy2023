import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from 'src/app/confirm-dialog/confirm-dialog.component';

export interface CanDeactivateComponent{
  canDeactivate: () => boolean | Observable<boolean>
}

@Injectable({
  providedIn: 'root'
})
export class DeactivateGuard implements CanDeactivate<unknown> {

  constructor(private dialog: MatDialog){}

  canDeactivate(
    component: CanDeactivateComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const result = component.canDeactivate();
      if (typeof result == "boolean" ) {
        if (result) return true;
        return this.askUser();
      }
      // observable
      return result.pipe(switchMap( ok => {
        if (ok) of(true);
        return this.askUser();
      }));
    }

    askUser(): Observable<boolean> {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: new ConfirmDialogData("Form not send",
                                    "Form is changed and not send, do you really want to go away?")}
      );
      return dialogRef.afterClosed();
    }


}
