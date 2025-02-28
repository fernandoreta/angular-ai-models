import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IModels } from 'src/interfaces/models.interface';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { UtilsService } from 'src/services/utils.service';
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

  constructor(
    private router: Router,
    private utilsService : UtilsService
  ) {}
  
  //Image to text.
  imagePath = 'assets/example.jpg';
  extractedText: string = '';

  footers: IModels[] = [
    {
      title: '🤖 AI Tools',
      navigate: () => this.router.navigate(['/']),
      show: true
    },
    {
      title: '📚 Notes',
      navigate: () => this.router.navigate(['/notes']),
      show: true
    },
    // Premium for next version
    // {
    //   title: '🪪 Profile',
    //   navigate: () => this.router.navigate(['/profile']),
    //   show: this.utilsService.isPremium
    // }
  ];

  backDashboard() {
    this.router.navigate(['/']);
  }
}