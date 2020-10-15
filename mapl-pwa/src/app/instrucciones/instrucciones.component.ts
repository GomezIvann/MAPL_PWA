import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Linea } from 'src/logica/compilador/Linea';
import { Programa } from 'src/logica/compilador/Programa';


@Component({
  selector: 'app-instrucciones',
  templateUrl: './instrucciones.component.html',
  styleUrls: ['./instrucciones.component.css']
})
export class InstruccionesComponent implements OnInit {
  // Lo recibe del componente padre app.component
  private _programa: Programa;
  
  // Define las columnas mostradas y establece su orden de aparicion
  displayedColumns: string[] = ["numeroInstruccion", "contenido"];

  /**
   * Altura de la fila px.
   * No es exactamente 45px como en el css ya que al usar la propiedad 'sticky: true' el desplazamiento
   * varia un poco (aprox. 0.2px).
   */ 
  private readonly ROW_HEIGHT: number = 44.8;

  constructor() {}

  ngOnInit(): void {}

  /**
   * Sobreescribimos el set y get para que cada vez que cambie el programa (idem el usuario carga uno nuevo).
   * El div haga scroll automatico a la cima del contenedor que muestra el fichero.
   */
  @Input() set programa(value: Programa) {
    this._programa = value;
    let div = document.getElementById("instrucciones-container");
    div.scrollTo({
      top: 0,
      behavior: 'smooth', // animacion
    });
  }
  get programa(): Programa {
    return this._programa;
  }

  recargarPrograma(el: HTMLElement) {
    this.programa.recargar();
    this.scrollToActualInstruction(el);
  }

  ejecutar(el: HTMLElement) {
    this.programa.ejecuccionCompleta();
    this.scrollToActualInstruction(el);
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
   *      scroll (px a desplazar dentro del div) = n * h
   *      siendo:
   *          n = numero fila (objeto Linea) actual ejecutandose
   *          h = altura de cada fila definido en el css = ROW_HEIGHT (en px)
   * @param container <div> contenedor de la tabla
   */
  scrollToActualInstruction(container: HTMLElement) {
    container.scrollTo({
      top: this.programa.getLineaByInstruccionActual() * this.ROW_HEIGHT,
      behavior: 'smooth', // animacion
    });
  }
}
