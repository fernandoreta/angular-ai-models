import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HighlightService {
  constructor() {
    this.checkOpenCVReady().then(() => {
      console.log('OpenCV.js cargado correctamente.');
    }).catch((error) => {
      console.error('Error al cargar OpenCV.js:', error);
    });
  }

  // Verificar si OpenCV está listo
  private checkOpenCVReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      const check = () => {
        if (typeof cv !== 'undefined' && cv.Mat) {
          resolve();
        } else {
          setTimeout(check, 100); // Verificar cada 100 ms
        }
      };

      check();
    });
  }

  // Método para detectar áreas resaltadas
  async detectHighlightedAreas(imageElement?: HTMLImageElement): Promise<void> {
    console.log(cv)
    cv.then((el: any) => {
      console.log(el);
      const mat = el.imread(imageElement); // Cargar la imagen en OpenCV
      const hsv = new el.Mat();
      el.cvtColor(mat, hsv, cv.COLOR_BGR2HSV);
  
      // Definir el rango de color para el resaltador (ejemplo: amarillo)
      const lowerYellow = new el.Mat(hsv.rows, hsv.cols, hsv.type(), [20, 100, 100, 0]);
      const upperYellow = new el.Mat(hsv.rows, hsv.cols, hsv.type(), [30, 255, 255, 255]);
  
      const mask = new el.Mat();
      el.inRange(hsv, lowerYellow, upperYellow, mask);
  
      // Aquí podrías encontrar contornos o procesar la máscara
      console.log('Máscara generada:', mask);
  
      // Liberar memoria
      // mat.delete();
      // hsv.delete();
      // lowerYellow.delete();
      // upperYellow.delete();
      // mask.delete();
    })
  }
}
