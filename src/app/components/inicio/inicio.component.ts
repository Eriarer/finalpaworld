import { AfterViewInit, Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { DomseguroPipe } from './domseguro.pipe';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [DomseguroPipe],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements AfterViewInit {
  video: string = "IPBB2iyVq7w";

  private synth: SpeechSynthesis; // Objeto para la síntesis de voz
  private utterance: SpeechSynthesisUtterance; // Objeto para gestionar las frases a sintetizar
  private isReading: boolean = false; // Estado de lectura en curso
  private isPause: boolean = false; // Estado de pausa
  private content: string = ''; // Contenido a ser leído

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    // Inicialización de la síntesis de voz
    this.synth = window.speechSynthesis;// 
    this.utterance = new SpeechSynthesisUtterance();
  }

  ngAfterViewInit(): void {
     // Re-inicialización de la síntesis de voz después de que la vista ha sido inicializada
     this.synth = window.speechSynthesis;
     this.utterance = new SpeechSynthesisUtterance();
     this.updateContent(); // Actualiza el contenido a ser leído
  }
 
  // Inicia la lectura del contenido
  startReading() {
    if (this.isReading) {
      // Si ya está leyendo, cancela la lectura actual
      this.synth.cancel();
    }

    // Establece el texto del contenido a ser leído
    this.utterance.text = this.content;
    this.synth.speak(this.utterance); // Comienza a leer el contenido

    this.isReading = true; // Marca el estado de lectura en curso
    this.isPause = false; // Marca el estado de pausa como falso

    // Evento que se dispara cuando termina la lectura
    this.utterance.onend = () => {
      this.isReading = false; // Marca el estado de lectura como no en curso
    };
  }

  // Pausa la lectura del contenido
  pauseReading() {
    if (this.synth) {
      this.synth.pause(); // Pausa la síntesis de voz
    }
    this.isPause = true; // Marca el estado de pausa como verdadero
    this.isReading = false; // Marca el estado de lectura como no en curso
  }

  // Reanuda la lectura del contenido
  resumeReading() {
    if (this.synth) {
      this.synth.resume(); // Reanuda la síntesis de voz
      this.isReading = true; // Marca el estado de lectura en curso
      this.isPause = false; // Marca el estado de pausa como falso
    }
  }

  // Detiene la lectura del contenido
  stopReading() {
    this.synth.cancel(); // Cancela la síntesis de voz
    this.isReading = false; // Marca el estado de lectura como no en curso
    this.isPause = false; // Marca el estado de pausa como falso
  }

  // Actualiza el contenido a ser leído extrayendo el texto de todos los elementos del componente
  updateContent() {
    const focusedElement = document.activeElement;
    if (focusedElement && focusedElement instanceof HTMLElement) {
      this.content = focusedElement.innerText.trim();
    }
  }

  // Maneja eventos de teclado para la navegación
  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      // Mover el foco al siguiente elemento
      this.moveFocus(true);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      // Mover el foco al elemento anterior
      this.moveFocus(false);
    }
  }

  private moveFocus(next: boolean) {
    const focusableElements = this.elementRef.nativeElement.querySelectorAll('[tabindex="0"]');
    const elementsArray = Array.from(focusableElements) as HTMLElement[];
    const currentIndex = elementsArray.indexOf(document.activeElement as HTMLElement);
    let nextIndex = next ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0) nextIndex = elementsArray.length - 1;
    if (nextIndex >= elementsArray.length) nextIndex = 0;
    elementsArray[nextIndex].focus();
    this.updateContent();
  }
}
