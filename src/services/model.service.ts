import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// @ts-ignore
import * as Tesseract from 'tesseract.js';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  constructor() { }
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
}
