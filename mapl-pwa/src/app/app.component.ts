import { Component } from '@angular/core';
import { Programa } from 'src/logica/compilador/Programa';
import { Globals } from './globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  version: string;

  /**
   * Crea y distribuye la misma instancia de Programa a todos los componentes de la aplicacion.
   * Si se modifica, ha de notificarse al componente padre (ej. instrucciones.component)
   */
  programa: Programa;

  constructor() {}

  ngOnInit(): void {
    this.programa = new Programa();
  }

  /**
   * Recibe el aviso de otro componente de que se ha cambiado la referencia de programa.
   * Cambia en el padre (app.component) y este notifica a los hijos de que ha cambiado (app-instrucciones y app-pila).
   * Esto es posible gracias a las notaciones @Input definidas en cada hijo, que estan constantemente escuchando si hay cambios
   * en el componente padre.
   * 
   * @param programa
   */
  recibirProgramaTrasUpload(programa: Programa) {
    this.programa = programa;
  }
}
