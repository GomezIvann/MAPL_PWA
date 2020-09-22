import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Parser } from 'src/logica/Parser';
import { Linea, Program } from 'src/logica/Program';

@Component({
  selector: 'app-instrucciones',
  templateUrl: './instrucciones.component.html',
  styleUrls: ['./instrucciones.component.css']
})
export class InstruccionesComponent implements OnInit {
  fileToUpload: File;
  program: Program;

  constructor() { }

  ngOnInit(): void { }

  async cargar(files: FileList) {
    this.fileToUpload = files.item(0);
    let tipoTexto = /text.*/; // solo archivos de texto

    if (this.fileToUpload.type.match(tipoTexto))
      this.cargarPrograma();
  }

  /**
   * Metodo que lee el fichero subido por el usuario y lo convierte en un programa
   * entendible por el interprete
   */
  private cargarPrograma() {
    let parser = new Parser(this.fileToUpload);
    this.program = parser.read();
  }

  recargarPrograma() {}

  ejecutar() {
    if (this.program != null)
      this.program.run();
  }
}
