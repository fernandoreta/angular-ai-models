import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { ModelService } from 'src/services/model.service';
import { Modes } from '../app.component';
import { pipeline } from '@xenova/transformers';
import { HighlightService } from '../highlight.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogQuestionsComponent } from '../dialog-questions/dialog-questions.component';
import { ISavedText, Types } from 'src/interfaces/models.interface';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'app-dialog-animations',
  templateUrl: './dialog-animations.component.html',
  styleUrls: ['./dialog-animations.component.scss']
})
export class DialogAnimationsComponent implements OnInit {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;
  constructor(
    private dialog: MatDialog,
    private modelService: ModelService,
    private highlightService: HighlightService,
    private fb: FormBuilder,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: { onSelectImage: () => void, mode: string }
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required], // Campo obligatorio
      type: ['book', Validators.required], // Valor predeterminado "book"
    });
  }

  cameraOn = false;
  imagePreview = '';
  extractedText = '';
  loadingText!: string;
  nameText!: string;
  typeText!: string;
  thinking = false;
  saveMode = false;
  form!: FormGroup;
  private questionsPipeline: any = null;

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
        const imageElement = new Image();
        imageElement.src = reader.result as string;
        this.imagePreview = reader.result as string;
        if (this.imagePreview) {
          this.executeModel(imageElement);
        }
      };

      reader.readAsDataURL(file);
    }
  }

  async getTextFromImage() {
    return this.modelService.recognizeText(this.imagePreview).pipe(take(1)).toPromise();
  }

  imageToText() {
    this.thinking = true;
    this.loadingText = 'Extracting Text';
    this.modelService.recognizeText(this.imagePreview).pipe(take(1))
    .subscribe({
      next: (text: string) => {
        this.thinking = false;
        this.extractedText = this.cleanExtractedText(text);
        this.imagePreview = '';
      },
      error: (err: any) => console.error('OCR error', err),
      complete: () => {
        this.thinking = false;
      },
    });
  }

  async loadSummarization() {
    if (!this.summarization) {
      this.summarization = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
    }
  }

  async resume() {
    try {
      this.loadingText = 'Resuming Text';
      this.thinking = true;
      await this.loadSummarization();
      const text = await this.getTextFromImage();
      const res = await this.summarization(text);
  
      this.extractedText = res[0].summary_text;
    } catch (error) {
      console.error('Error during resume:', error);
    } finally {
      this.thinking = false;
      this.imagePreview = '';
    }
  }
  
  
  //Resume
  // https://huggingface.co/tasks/summarization
  private summarization: any;
  resumeText = '';

  openQuestionsDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(DialogQuestionsComponent, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration
    });
  }

  async loadQuestionsPipeline() {
    if (!this.questionsPipeline) { // Solo carga el modelo si no está ya en memoria.
      this.questionsPipeline = await pipeline('document-question-answering', 'Xenova/donut-base-finetuned-docvqa');
    }
  }

  async questionsModel() {
    this.thinking = true;
    await this.loadQuestionsPipeline();
    this.thinking = false;

    const dialogRef = this.dialog.open(DialogQuestionsComponent, {
      data: { animal: '' },
    });
    const dialogResult = await dialogRef.afterClosed().toPromise();

    if (dialogResult !== undefined) {
      this.thinking = true;
      try {
        const output = await this.questionsPipeline(this.imagePreview, dialogResult);
        this.imagePreview = '';
        console.log(output);
        const result = output[0] as any;
        this.extractedText = result.answer;
      } catch (error) {
        console.error('Error during pipeline processing:', error);
      } finally {
        this.thinking = false;
      }
    }
  }
 
  isPlaying!: boolean;
  synthesisInstance!: SpeechSynthesisUtterance;
  isAudio!: boolean;
  progress = 0;
  interval: any;

  async textToAudioModel() {
    this.thinking = true;
    const text = await this.getTextFromImage();
    this.synthesisInstance = new SpeechSynthesisUtterance(text);
  
    this.synthesisInstance.onstart = () => {
      this.isPlaying = true;
      this.isAudio = true;
      this.startProgressTracker();
    };
  
    this.synthesisInstance.onend = () => {
      this.isPlaying = false;
      this.resetProgressTracker();
    };
  
    window.speechSynthesis.speak(this.synthesisInstance);
    this.imagePreview = '';
    this.thinking = false;
  }
  
  pauseAudio() {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      this.isPlaying = false;
      clearInterval(this.interval);
    }
  }
  
  resumeAudio() {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.isPlaying = true;
      this.startProgressTracker();
    } else {
      window.speechSynthesis.speak(this.synthesisInstance);
    }
  }
  
  stopAudio() {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      this.isPlaying = false;
      this.resetProgressTracker();
    }
  }
  
  startProgressTracker() {
    const estimatedDuration = this.synthesisInstance?.text.length * 50; // Estimación: 50ms por carácter
    const startTime = Date.now();
  
    this.interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      this.progress = Math.min((elapsed / estimatedDuration) * 100, 100);
  
      if (this.progress >= 100) {
        clearInterval(this.interval);
      }
    }, 100);
  }
  
  resetProgressTracker() {
    clearInterval(this.interval);
    this.progress = 0;
  }
  

  async executeModel(imageElement?: HTMLImageElement): Promise<void> {
    if (this.data.mode === Modes.imageToText) {
      this.imageToText();
    } else if (this.data.mode === Modes.resume) {
      this.resume();
    } else if (this.data.mode === Modes.questions) {
      this.questionsModel();
    } else if (this.data.mode === Modes.textToAudio) {
      this.textToAudioModel();
    } else if (this.data.mode === Modes.highlight) {
      console.log('Loading model 💭');
      this.thinking = true;
      // wait to be more realistic
      setTimeout(() => {
        this.highlightService.detectHighlightedAreas(imageElement);
        this.thinking = false;
      }, 3000);
    }
  }

  private cleanExtractedText(text: string): string {
    let cleanedText = text.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    if (cleanedText.length < 10 || cleanedText.includes('¥')) {
      console.warn('Texto extraído parece incompleto o con errores.');
      return 'Texto no válido';
    }
      return cleanedText;
  }

   /**
   * Close the dialog and return the selected image.
   */
   confirmSelection(): void {
    const { name, type } = this.form.value;

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const newText: ISavedText = {
      name: capitalize(name),
      type: capitalize(type) as Types,
      content: this.extractedText
    };

    const savedTexts = localStorage.getItem('saved-texts');
    let updatedTexts: ISavedText[] = savedTexts ? JSON.parse(savedTexts) : [];
    
    const isDuplicate = updatedTexts.some(item => item.name === newText.name);
    if (isDuplicate) {
      this.utilsService.openSnackBar('Choose other name for your note, this is taken 😿');
      return;
    }
    if (updatedTexts?.length >= 5) {
      this.utilsService.openSnackBar('Only 5 text allowed in free version 😢');
    } else {
      updatedTexts.push(newText);
      localStorage.setItem('saved-texts', JSON.stringify(updatedTexts));
      this.utilsService.openSnackBar('Text Added');
    }
  }

  takePhoto() {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
  
        const file = new File([blob], 'captured-image.png', { type: 'image/png' });
  
        // Asignar al input file
        const fileInput = document.getElementById('imageInput') as HTMLInputElement;
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
  
        // Crear evento para llamar a onImageSelected() manualmente
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
        this.cameraOn = false;
        // Llamar directamente a la función onImageSelected()
        this.onImageSelected({ target: fileInput } as unknown as Event);
      }, 'image/png');
    }
  }
  
  

  openCamera() {
    this.cameraOn = true;
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      this.videoElement.nativeElement.srcObject = stream;
    })
    .catch(error => console.error('Error', error));
  }

  ngOnInit(): void {
  }

}
