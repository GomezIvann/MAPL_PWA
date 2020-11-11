import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Linea } from 'src/logica/compilador/Linea';
import { Programa } from 'src/logica/compilador/Programa';
import { ProgramParser } from 'src/logica/util/ProgramParser';
import { Globals } from '../globals';


@Component({
  selector: 'app-instrucciones',
  templateUrl: './instrucciones.component.html',
  styleUrls: ['./instrucciones.component.css']
})
export class InstruccionesComponent implements OnInit {
  // Lo recibe del componente padre app.component
  private _programa: Programa;
  fileToUpload: File; // Fichero .txt seleccionado por el usuario

  // Objeto encargado de notificar al componente padre el cambio de referencia de programa (de producirse).
  @Output () programResponse: EventEmitter<Programa> = new EventEmitter();
  
  // Define las columnas mostradas y establece su orden de aparicion
  displayedColumns: string[];

  // Altura de la fila px (la misma que en el css).
  private readonly ROW_HEIGHT: number = 20;

  constructor(public globals: Globals) {
    this.displayedColumns = ["numeroInstruccion", "contenido"];
  }

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

  disableBotones(): boolean {
    return !this.programa.isEjecutable();
  }

  reiniciarPrograma() {
    this.programa.reiniciar();
    this.scrollToActualInstruction();
  }

  ejecutar() {
    this.programa.ejecuccionCompleta();
    this.scrollToActualInstruction();
  }

  ejecutarInstruccion() {
    this.programa.ejecutarSiguienteInstruccion();
    this.scrollToActualInstruction();
  }

  seleccionarInstruccion(event, row: Linea) {
    if (row.numeroInstruccion !== "") {
      let indice = parseInt(row.numeroInstruccion);
      if (event.shiftKey && row !== undefined)
        this.programa.retrocederHasta(indice);
      else
        this.programa.ejecutarHasta(indice);
    }

    if (this.programa.finalizado) // Hace solo scroll si el programa se ejecuta hasta el final (por el motivo que sea)
      this.scrollToActualInstruction();
  }

  retrocederInstruccion() {
    this.programa.retrocederUnaInstruccion();
    this.scrollToActualInstruction();
  }

  /**
   * Desplaza el scroll para enfocar a la instrucciona actual ejecutandose
   * El calculo se realiza de la siguiente forma:
   *      scroll (px a desplazar dentro del div) = (n * h) - 150
   *      siendo:
   *          n = numero fila (objeto Linea) actual ejecutandose
   *          h = altura de cada fila definido en el css = ROW_HEIGHT (en px)
   *          -150: mantener en una posicion central a la instruccion actual,
   *                sin ese desplazamiento quedaria en la parte superior de la tabla
   */
  scrollToActualInstruction() {
    let container = document.getElementById("instrucciones-container");
    container.scrollTo({
      top: (this.programa.getLineaByInstruccionActual() * this.ROW_HEIGHT)-150,
      behavior: 'smooth', // animacion
    });
  }
  
  cargar(files: FileList) {
    this.fileToUpload = files.item(0);
    let tipoTexto = /text.*/; // solo archivos de texto
    if (this.fileToUpload.type.match(tipoTexto))
      this.cargarPrograma();
  }

  /**
   * Metodo ASINCRONO que lee el fichero subido por el usuario y lo convierte en un programa
   * entendible por el interprete (en caso de que este bien formado). Tambien limpia la consola.
   * Cuando finaliza la lectura (await), se notifica al padre de que la referencia de programa a cambiado 
   * y se le pasa el nuevo valor. Gracias a esto, todos los componentes de la app usan la misma instancia
   * de programa (aquellos que lo necesitan).
   */
  private async cargarPrograma() {
    try {
      let parser = new ProgramParser(this.fileToUpload);
      let programa = await parser.read();

      if (!programa.hasIncidencias()) {
        this.programa = programa;
      }
      else
        this.programa = new Programa(); // Vaciamos el programa anterior

      this.programResponse.emit(this._programa); // Notificamos al componente padre (app.component)
    } 
    catch (err) {
      throw new Error("No se ha podido leer el archivo especificado.");
    }
  }
}
