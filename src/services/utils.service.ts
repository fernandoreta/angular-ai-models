import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private _snackBar: MatSnackBar) { }

  isPremium = false;

  openSnackBar(text?: string) {
    this._snackBar.open(text ? text : 'Successfully', 'Dismiss', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000
    });
  }
}
