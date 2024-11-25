import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { pipeline, env } from '@xenova/transformers';
import { take } from 'rxjs';
import { IModels } from 'src/interfaces/models.interface';
import { ModelService } from 'src/services/model.service';
import { DialogAnimationsComponent } from './dialog-animations/dialog-animations.component';
import { MatDialog } from '@angular/material/dialog';
import { animate, style, transition, trigger } from '@angular/animations';

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
    { title: '🌠 Image to Text', action: () => this.openDialog('300ms', '300ms') },
    { title: '📒 Resume', action: () => this.resume() },
    { title: '🙋🏽 Questions', action: () => {} },
    { title: '🎙️ Text to Audio', action: () => {} },
    { title: '🖋️ Get your Highlight Text', action: () => {} }
  ];

  footers: IModels[] = [
    { title: '📚 Books', action: () => {} },
    { title: '🔖 Articles', action: () => {} },
    { title: '🔍 Search', action: () => {} },
    { title: '🪪 Profile', action: () => {} },
  ];

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogAnimationsComponent, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration
    });
  }
  
  //Resume
  // https://huggingface.co/tasks/summarization
  private summarization: any;
  text = `La revolución de la inteligencia artificial en la medicina
En los últimos años, la inteligencia artificial (IA) ha transformado el sector de la salud, proporcionando herramientas innovadoras para el diagnóstico, el tratamiento y la gestión de pacientes. Los algoritmos avanzados, como el aprendizaje automático y el aprendizaje profundo, permiten analizar grandes volúmenes de datos médicos con una precisión sin precedentes. Por ejemplo, sistemas basados en IA pueden detectar anomalías en radiografías con una precisión similar o incluso superior a la de los médicos experimentados.

Además, las aplicaciones de IA en la medicina no se limitan al diagnóstico. También están revolucionando la investigación farmacéutica al identificar posibles compuestos para nuevos medicamentos de manera más eficiente. En el campo de la atención personalizada, los sistemas de IA pueden recomendar tratamientos adaptados a las características específicas de cada paciente, mejorando los resultados clínicos.

Sin embargo, el uso de la IA en la salud plantea desafíos importantes, como la privacidad de los datos, la regulación y la necesidad de garantizar que estas herramientas se utilicen de manera ética. A medida que la tecnología avanza, la colaboración entre expertos en tecnología, médicos y legisladores será crucial para maximizar los beneficios de la IA y minimizar sus riesgos.`;
  resumeText = '';

  async loadSummarization() {
    this.summarization = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
  }

  async resume() {
    console.log('Loading model 💭');
    await this.loadSummarization();
    console.log('Model charged!🚀');
    console.log('Resuming 🤔');
    const res = await this.summarization(this.text);
    this.resumeText = res[0].summary_text;
    console.log(res[0].summary_text);
    console.log('Resume Complete!📝');
  }
}
