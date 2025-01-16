import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
// @ts-ignore
import * as Tesseract from 'tesseract.js';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  constructor(private snackBar: MatSnackBar) { }
  recognizeText(imagePath: string): Observable<string> {
    return new Observable((observer) => {
      Tesseract.recognize(imagePath, 'eng', {
        logger: (m) => console.log(m),
      })
        .then(({ data: { text } }) => {
          observer.next(text);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  showSnackBar(text: string) {
    this.snackBar.open(text, '🚀', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
