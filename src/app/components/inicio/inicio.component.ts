import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { DomseguroPipe } from './domseguro.pipe';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [DomseguroPipe, MatButtonToggleModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements AfterViewInit {
  video: string = 'IPBB2iyVq7w';

  private synth: SpeechSynthesis; // Objeto para la síntesis de voz
  private utterance: SpeechSynthesisUtterance; // Objeto para gestionar las frases a sintetizar
  isReading: boolean = false; // Estado de lectura en curso
  isPause: boolean = false; // Estado de pausa
  private content: string = ''; // Contenido a ser leído
  currentFontSize: number = 18; // Tamaño de fuente actual
  accessibilityMode: boolean = false; // Modo de accesibilidad (invertir colores)
  isCursorLarge: boolean = false; // Tamaño del cursor

  @ViewChild('filterBtn', { static: true }) filterBtn: ElementRef | undefined;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    // Inicialización de la síntesis de voz
    this.synth = window.speechSynthesis; //
    this.utterance = new SpeechSynthesisUtterance();
  }
  //Funciones para boton accesibilidad
  ngOnInit() {
    if (this.filterBtn) {
      // Add event listener to the toggle button
      const toggleBtn =
        this.filterBtn.nativeElement.querySelector('.toggle-btn');
      this.renderer.listen(toggleBtn, 'click', () => {
        this.toggleMenu();
      });

      // Add event listeners to the menu options
      const menuOptions = this.filterBtn.nativeElement.querySelectorAll('a');
      menuOptions.forEach((option: HTMLElement) => {
        this.renderer.listen(option, 'click', () => {
          this.closeMenu();
        });
      });
    }
  }

  ngOnDestroy() {
    if (this.filterBtn) {
      // Remove event listener from the toggle button
      const toggleBtn =
        this.filterBtn.nativeElement.querySelector('.toggle-btn');
      toggleBtn.removeEventListener('click', () => {
        this.toggleMenu();
      });

      // Remove event listeners from the menu options
      const menuOptions = this.filterBtn.nativeElement.querySelectorAll('a');
      menuOptions.forEach((option: HTMLElement) => {
        option.removeEventListener('click', () => {
          this.closeMenu();
        });
      });
    }
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.utterance) {
      this.utterance.onend = null;
    }
    if (this.isCursorLarge) {
      document.body.classList.remove('cursorGrande');
    }
    if (this.accessibilityMode) {
      document.body.classList.remove('accessibility-mode');
    }
    if(this.currentFontSize != 18){
      const elements = this.elementRef.nativeElement.querySelectorAll(
        'h2, h3, p, .card-title, .card-text'
      );
  
      elements.forEach((element: HTMLElement) => {
        this.renderer.setStyle(element, 'font-size', `18px`); // Establece el nuevo tamaño de fuente en los elementos seleccionados
      });
    }
  }

  toggleMenu() {
    if (!this.filterBtn) return;
    if (this.filterBtn.nativeElement.classList.contains('open')) {
      this.renderer.removeClass(this.filterBtn.nativeElement, 'open');
    } else {
      this.renderer.addClass(this.filterBtn.nativeElement, 'open');
    }
  }

  closeMenu() {
    if (!this.filterBtn) return;
    this.renderer.removeClass(this.filterBtn.nativeElement, 'open');
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
    const uniqueTextContent = new Set<string>(); // Utilizamos un Set para evitar texto duplicado
    const pageContent = this.elementRef.nativeElement.querySelectorAll(
      'i, button, h1, p, h2, a, h5, footer, h3'
    ); //seleccionamos todos los elementos de la pagina
    this.content = '';

    pageContent.forEach((item: HTMLElement) => {
      if (
        item.innerText &&
        item.innerText.trim() &&
        !uniqueTextContent.has(item.innerText.trim())
      ) {
        uniqueTextContent.add(item.innerText.trim()); // Añadimos el texto al Set para evitar duplicados
        this.content += item.innerText.trim() + ' ';
      }
    });
  }

  // Maneja eventos de teclado para la navegación
  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      // Mover el foco al siguiente elemento
      if (event.target) {
        const nextElement = (event.target as HTMLElement)
          .nextElementSibling as HTMLElement;
        if (nextElement) {
          nextElement.focus(); // Establece el foco en el siguiente elemento
        }
      }
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      // Mover el foco al elemento anterior
      if (event.target) {
        const previousElement = (event.target as HTMLElement)
          .previousElementSibling as HTMLElement;
        if (previousElement) {
          previousElement.focus(); // Establece el foco en el elemento anterior
        }
      }
    }
  }

  // Alterna el tamaño del cursor (modo de accesibilidad)
  toggleCursorSize() {
    this.isCursorLarge = !this.isCursorLarge;
    document.body.classList.toggle('cursorGrande'); // Agrega o quita la clase 'cursorGrande' del cuerpo del documento
  }

  // Aumenta el tamaño del texto (modo de accesibilidad)
  toggleTextSizeA() {
    this.currentFontSize += 2; // Incrementa el tamaño de la fuente en 2px
    const elements = this.elementRef.nativeElement.querySelectorAll(
      'h2, h3, p, .card-title, .card-text'
    );

    elements.forEach((element: HTMLElement) => {
      this.renderer.setStyle(element, 'font-size', `${this.currentFontSize}px`); // Establece el nuevo tamaño de fuente en los elementos seleccionados
    });
  }

  // Disminuye el tamaño del texto (modo de accesibilidad)
  // Aumenta el tamaño del texto (modo de accesibilidad)
  toggleTextSizeD() {
    this.currentFontSize -= 2; // decrementa el tamaño de la fuente en 2px
    const elements = this.elementRef.nativeElement.querySelectorAll(
      'h2, h3, p, .card-title, .card-text'
    );

    elements.forEach((element: HTMLElement) => {
      this.renderer.setStyle(element, 'font-size', `${this.currentFontSize}px`); // Establece el nuevo tamaño de fuente en los elementos seleccionados
    });
  }

  // Alterna el modo de inversión de colores (modo de accesibilidad)
  toggleInvertColors() {
    this.accessibilityMode = !this.accessibilityMode;
    if (this.accessibilityMode) {
      this.renderer.addClass(document.body, 'accessibility-mode'); // Agrega la clase 'accessibility-mode' al cuerpo del documento
    } else {
      this.renderer.removeClass(document.body, 'accessibility-mode'); // Quita la clase 'accessibility-mode' del cuerpo del documento
    }
  }
}
