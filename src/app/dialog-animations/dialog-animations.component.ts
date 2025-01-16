import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { ModelService } from 'src/services/model.service';
import { Modes } from '../app.component';
import { pipeline } from '@xenova/transformers';
import { HighlightService } from '../highlight.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-animations',
  templateUrl: './dialog-animations.component.html',
  styleUrls: ['./dialog-animations.component.scss']
})
export class DialogAnimationsComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DialogAnimationsComponent>,
    private modelService: ModelService,
    private highlightService: HighlightService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { onSelectImage: () => void, mode: string }
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required], // Campo obligatorio
      type: ['book', Validators.required], // Valor predeterminado "book"
    });
  }

  imagePreview = '';
  extractedText = '';
  nameText!: string;
  typeText!: string;
  thinking = false;
  saveMode = false;
  form!: FormGroup;

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

  imageToText() {
    this.thinking = true;
    this.modelService.recognizeText(this.imagePreview).pipe(take(1))
    .subscribe({
      next: (text: string) => {
        this.thinking = false;
        this.extractedText = this.cleanExtractedText(text);
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

  async loadSummarization() {
    this.summarization = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
  }

  async resume() {
    console.log('Loading model 💭');
    this.thinking = true;
    await this.loadSummarization();
    console.log('Model charged!🚀');
    console.log('Resuming 🤔');
    const res = await this.summarization(this.text);
    this.extractedText = res[0].summary_text;
    this.thinking = false;
    this.imagePreview = ''
    console.log(this.extractedText);
    console.log('Resume Complete!📝');
  }
  
  //Resume
  // https://huggingface.co/tasks/summarization
  private summarization: any;
  text = `La revolución de la inteligencia artificial en la medicina
    En los últimos años, la inteligencia artificial (IA) ha transformado el sector de la salud, proporcionando herramientas innovadoras para el diagnóstico, el tratamiento y la gestión de pacientes. Los algoritmos avanzados, como el aprendizaje automático y el aprendizaje profundo, permiten analizar grandes volúmenes de datos médicos con una precisión sin precedentes. Por ejemplo, sistemas basados en IA pueden detectar anomalías en radiografías con una precisión similar o incluso superior a la de los médicos experimentados.

    Además, las aplicaciones de IA en la medicina no se limitan al diagnóstico. También están revolucionando la investigación farmacéutica al identificar posibles compuestos para nuevos medicamentos de manera más eficiente. En el campo de la atención personalizada, los sistemas de IA pueden recomendar tratamientos adaptados a las características específicas de cada paciente, mejorando los resultados clínicos.

    Sin embargo, el uso de la IA en la salud plantea desafíos importantes, como la privacidad de los datos, la regulación y la necesidad de garantizar que estas herramientas se utilicen de manera ética. A medida que la tecnología avanza, la colaboración entre expertos en tecnología, médicos y legisladores será crucial para maximizar los beneficios de la IA y minimizar sus riesgos.`;
  resumeText = '';

  async questionsModel() {
    console.log('Loading model 💭');
    this.thinking = true;
    this.imagePreview = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/invoice.png';
    const questionsPipeline = await pipeline('document-question-answering', 'Xenova/donut-base-finetuned-docvqa');
    console.log('Model charged!🚀');
    const question = 'What is the invoice number?';
    const output = await questionsPipeline(this.imagePreview, question);
    this.imagePreview = '';
    this.thinking = false;
    console.log(output);
    const result = output[0] as any;
    this.extractedText = result.answer;
  }

  async textToAudioModel() {
    console.log('Loading model 💭');
    this.thinking = true;
    const synthesis = new SpeechSynthesisUtterance('Hello, my name is Fernando, Happy New Year!');
    window.speechSynthesis.speak(synthesis);
    this.imagePreview = '';
    this.thinking = false;
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
    console.log(this.extractedText);
    console.log('Name:', name);
    console.log('Type:', type);
    this.modelService.showSnackBar('Text Saved');
    // this.dialogRef.close(this.imagePreview);
  }

  ngOnInit(): void {
  }

}
