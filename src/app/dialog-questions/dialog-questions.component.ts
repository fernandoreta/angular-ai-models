import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-questions',
  templateUrl: './dialog-questions.component.html',
  styleUrls: ['./dialog-questions.component.scss']
})
export class DialogQuestionsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogQuestionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { question: string }
  ) { }

  onSave(): void {
    this.dialogRef.close(this.data.question);
  }

  ngOnInit(): void {
  }

}
