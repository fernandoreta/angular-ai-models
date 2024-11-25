import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-animations',
  templateUrl: './dialog-animations.component.html',
  styleUrls: ['./dialog-animations.component.scss']
})
export class DialogAnimationsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogAnimationsComponent>) {}

  ngOnInit(): void {
  }

}
