import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-animations',
  templateUrl: './dialog-animations.component.html',
  styleUrls: ['./dialog-animations.component.scss']
})
export class DialogAnimationsComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DialogAnimationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { onSelectImage: () => void }
  ) {}

  imagePreview: string | null = null;

  removeImage() {
    this.imagePreview = null;
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
        // this.extractTextFromImage();
      };

      reader.readAsDataURL(file);
    }
  }

   /**
   * Close the dialog and return the selected image.
   */
   confirmSelection(): void {
    this.dialogRef.close(this.imagePreview);
  }

  ngOnInit(): void {
  }

}
