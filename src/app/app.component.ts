import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { pipeline, env } from '@xenova/transformers';
import { take } from 'rxjs';
import { IModels } from 'src/interfaces/models.interface';
import { ModelService } from 'src/services/model.service';
import { DialogAnimationsComponent } from './dialog-animations/dialog-animations.component';
import { MatDialog } from '@angular/material/dialog';
import { animate, style, transition, trigger } from '@angular/animations';
export enum Modes {
  imageToText = 'imageToText',
  resume = 'resume',
  questions = 'questions',
  textToAudio = 'textToAudio'
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
    private modelService: ModelService,
    private dialog: MatDialog
  ) {}
  
  //Image to text.
  imagePath = 'assets/example.jpg';
  extractedText: string = '';

  models: IModels[] = [
    { title: '🌠 Image to Text', action: () => this.openDialog('300ms', '300ms', Modes.imageToText) },
    { title: '📒 Resume', action: () => this.openDialog('300ms', '300ms', Modes.resume) },
    { title: '🙋🏽 Questions', action: () => this.openDialog('300ms', '300ms', Modes.questions) },
    { title: '🎙️ Text to Audio', action: () => this.openDialog('300ms', '300ms', Modes.textToAudio) },
    { title: '🖋️ Get your Highlight Text', action: () => {} }
  ];

  footers: IModels[] = [
    { title: '📚 Books', action: () => {} },
    { title: '🔖 Articles', action: () => {} },
    { title: '🔍 Search', action: () => {} },
    { title: '🪪 Profile', action: () => {} },
  ];

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, mode: string): void {
    this.dialog.open(DialogAnimationsComponent, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        mode
      }
    });
  }
}