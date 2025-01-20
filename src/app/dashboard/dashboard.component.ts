import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IModels } from 'src/interfaces/models.interface';
import { DialogAnimationsComponent } from '../dialog-animations/dialog-animations.component';
import { Modes } from '../app.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  models = [
    { title: '🌠 Image to Text', action: () => this.openDialog('300ms', '300ms', Modes.imageToText) },
    { title: '📒 Resume', action: () => this.openDialog('300ms', '300ms', Modes.resume) },
    { title: '🙋🏽 Questions', action: () => this.openDialog('300ms', '300ms', Modes.questions) },
    { title: '🎙️ Text to Audio', action: () => this.openDialog('300ms', '300ms', Modes.textToAudio) },
    { title: '🖋️ Highlight Text', action: () => this.openDialog('300ms', '300ms', Modes.highlight) }
  ];
  constructor(private dialog: MatDialog) { }

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

  ngOnInit(): void {
  }

}
