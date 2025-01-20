import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { pipeline, env } from '@xenova/transformers';
import { take } from 'rxjs';
import { IModels } from 'src/interfaces/models.interface';
import { ModelService } from 'src/services/model.service';
import { DialogAnimationsComponent } from './dialog-animations/dialog-animations.component';
import { MatDialog } from '@angular/material/dialog';
import { animate, style, transition, trigger } from '@angular/animations';
import { DialogQuestionsComponent } from './dialog-questions/dialog-questions.component';
import { Router } from '@angular/router';
export enum Modes {
  imageToText = 'imageToText',
  resume = 'resume',
  questions = 'questions',
  textToAudio = 'textToAudio',
  highlight = 'highlight'
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class AppComponent {
  @ViewChild('imageContainer', { static: false }) imageContainer!: ElementRef;
  title = 'InstaRead';

  constructor(private router: Router) {}
  
  //Image to text.
  imagePath = 'assets/example.jpg';
  extractedText: string = '';

  footers: IModels[] = [
    {
      title: '📚 Notes',
      navigate: () => this.router.navigate(['/notes'])
    },
    {
      title: '🔍 Search',
      navigate: () => this.router.navigate(['/search'])
    },
    {
      title: '🪪 Profile',
      navigate: () => this.router.navigate(['/profile'])
    }
  ];

  backDashboard() {
    this.router.navigate(['/']);
  }
}