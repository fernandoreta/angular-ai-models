import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { pipeline, env } from '@xenova/transformers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-models';
  @ViewChild('imageContainer', { static: false }) imageContainer!: ElementRef;
  status: string = 'Loading model...';
  imageSrc: any;
  private objectDetector: any;
  private questionAnswer: any;
  private summarization: any;

  // Speech
  async runSpeechModel() {
    env.allowLocalModels = false;
    const pipe = await pipeline('automatic-speech-recognition');
    let result = await pipe('https://huggingface.co/datasets/Narsil/asr_dummy/resolve/main/mlk.flac');
    console.log(result);
  }

  // Image Detection
  async onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        this.imageSrc = e.target?.result;
        this.imageContainer.nativeElement.innerHTML = ''; // Clear previous boxes
        const image = new Image();
        image.src = this.imageSrc as string;
        image.onload = async() => {
          this.imageContainer.nativeElement.appendChild(image);
          await this.detect(image, this.imageContainer.nativeElement);
        };
      };
      reader.readAsDataURL(file);
    }
  }

  async detect(image: HTMLImageElement, container: HTMLElement) {
    const output = await this.objectDetector(image.src, {
      threshold: 0.5,
      percentage: true,
    });
    output.forEach((result: any) => this.renderBox(result, container));
  }

  renderBox({ box, label }: any, container: HTMLElement) {
    const { xmax, xmin, ymax, ymin } = box;

    // Generate a random color for the box
    const color = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');

    // Draw the box
    const boxElement = document.createElement('div');
    boxElement.className = 'bounding-box';
    Object.assign(boxElement.style, {
      borderColor: color,
      left: 100 * xmin + '%',
      top: 100 * ymin + '%',
      width: 100 * (xmax - xmin) + '%',
      height: 100 * (ymax - ymin) + '%',
      position: 'absolute',
      border: '2px solid',
      boxSizing: 'border-box',
      pointerEvents: 'none',
    });

    // Draw label
    const labelElement = document.createElement('span');
    labelElement.textContent = label;
    labelElement.className = 'bounding-box-label';
    Object.assign(labelElement.style, {
      backgroundColor: color,
      color: 'white',
      padding: '2px 4px',
      position: 'absolute',
      top: '0',
      left: '0',
    });

    boxElement.appendChild(labelElement);
    container.appendChild(boxElement);
  }

  async loadDetectorModel() {
    this.objectDetector = await pipeline('object-detection', 'Xenova/detr-resnet-50');
  }

  // Answer Question
  // https://huggingface.co/distilbert/distilbert-base-cased-distilled-squad
  // historyText = `In a small village, people relied on a well for water.
  // One day, the well dried up, causing panic.
  // The villagers worked together to dig a new well,
  // discovering a fresh water source.
  // This experience taught them the importance of cooperation and perseverance,
  // ensuring the village's survival`;
  historyText = `This is an automated mechanism which was designed and implemented to prevent changes from being merged into the main (develop) branch when there are failures in the CI build. When the CI build reports failures, the lock will be automatically enabled, and once the CI build succeeds, the lock will be removed.
When the CI Lock Policy is ON, the mechanism will automatically add a required reviewer group called "Platform-UX-LockApprovers" to all active PRs. Only people that belong to this group has permissions to allow PRs to be merged, and they will only approve PRs that will potentially fix the alpha failures.
As of today, this is the group of lock approvers:
When the CI Lock Policy is OFF, the mechanism will make the existing reviewer called "Platform-UX-LockApprovers" no longer required. **IMPORTANT**: please note that this mechanism will NOT remove the reviewer from the PR, you will need to do it manually.`;
  question1 = 'What triggers the CI lock mechanism to enable or disable the lock?';
  question2 = 'Who has the authority to approve PRs when the CI Lock Policy is ON? ';
  question3 = 'What is the role of the "Platform-UX-LockApprovers" group in the CI Lock Policy?';

  async answer(option?: number) {
    const context = this.historyText;
    let question: string;
    if (option === 1) {
      question = this.question1;
    } else if (option === 2) {
      question = this.question2;
    } else {
      question = this.question3;
    }
    const res = await this.questionAnswer(question, context);
    console.log(res);
  }

  async loadQuestionAnswerModel() {
    this.questionAnswer = await pipeline('question-answering', 'Xenova/distilbert-base-cased-distilled-squad');
  }

  //Resume
  // https://huggingface.co/tasks/summarization
  async loadSummarization() {
    this.summarization = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
  }

  async resume() {
    const inputs = 'Paris is the capital and most populous city of France, with an estimated population of 2,175,601 residents as of 2018, in an area of more than 105 square kilometres (41 square miles). The City of Paris is the centre and seat of government of the region and province of Île-de-France, or Paris Region, which has an estimated population of 12,174,880, or about 18 percent of the population of France as of 2017.';
    const res = await this.summarization(inputs);
    console.log(res)
  }

  async ngOnInit() {
    env.allowLocalModels = false;
    // await this.loadSummarization();
    await this.loadQuestionAnswerModel();
    // await this.loadDetectorModel();
    this.status = 'Image Model Ready';
  }

}
