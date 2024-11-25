import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { ModelService } from 'src/services/model.service';

@Component({
  selector: 'app-dialog-animations',
  templateUrl: './dialog-animations.component.html',
  styleUrls: ['./dialog-animations.component.scss']
})
export class DialogAnimationsComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DialogAnimationsComponent>,
    private modelService: ModelService,
    @Inject(MAT_DIALOG_DATA) public data: { onSelectImage: () => void }
  ) {}

  imagePreview = '';
  extractedText = '';
  thinking = false;

  removeImage() {
    this.imagePreview = '';
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    fileInput.value = '';
  }
  /**
   * Open the dialog image.
   */
  onSelectImage(): void {
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    fileInput.click();
  }

  /**
   * Manage the selection image.
   */
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        if (this.imagePreview) {
          this.extractTextFromImage();
        }
      };

      reader.readAsDataURL(file);
    }
  }

  extractTextFromImage(): void {
    console.log('Extracting Text ⌛️');
    this.thinking = true;
    this.modelService.recognizeText(this.imagePreview).pipe(take(1))
    .subscribe({
      next: (text: string) => {
        this.thinking = false;
        this.extractedText = text;
        this.imagePreview = '';
        console.log('Text Extracted Successfully! 🎉');
        console.log(this.extractedText);
      },
      error: (err: any) => console.error('OCR error', err),
      complete: () => {
        console.log('OCR process complete 🚀');
        this.thinking = false;
      },
    });
  }

   /**
   * Close the dialog and return the selected image.
   */
   confirmSelection(): void {
    console.log('confirm');
    // this.dialogRef.close(this.imagePreview);
  }

  ngOnInit(): void {
  }

}
