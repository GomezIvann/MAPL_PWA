import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Linea, Programa } from 'src/logica/compilador/Programa';


@Component({
  selector: 'app-instrucciones',
  templateUrl: './instrucciones.component.html',
  styleUrls: ['./instrucciones.component.css']
})
export class InstruccionesComponent implements OnInit {
  @Input() programa: Programa; // Lo recibe del componente padre app.component
  displayedColumns: string[]; // Define las columnas mostradas y establece su orden de aparicion
  private readonly ROW_HEIGHT: number = 45;

  constructor() {}

  ngOnInit(): void { 
    this.displayedColumns = ["numeroInstruccion", "contenido"];
  }

  recargarPrograma() {}

  ejecutar() {
    this.programa.ejecuccionCompleta();
  }

  ejecutarInstruccion(el: HTMLElement) {
    this.programa.ejecutarSiguienteInstruccion();
    this.scrollToActualInstruction(el);
  }

  ejecutarHasta(row: Linea) {
    this.programa.ejecutarHasta(row);
  }

  /**
   * Desplaza el scroll para enfocar a la instrucciona actual ejecutandose
   * El calculo se realiza de la siguiente forma:
   *      scroll (px a desplazar dentro del div) = h * t
   *      siendo:
   *          h = numero fila (objeto Linea) actual ejecutandose. 
   *          t = altura de cada fila definido en el css
   * @param container <div> contenedor de la tabla
   */
  scrollToActualInstruction(container: HTMLElement) {
    container.scrollTo({
      top: this.programa.getLineaByInstruccionActual() * this.ROW_HEIGHT,
      behavior: 'smooth', // animacion
    });
  }
}
