import { Component } from '@angular/core';
import { Parser } from 'src/logica/util/Parser';
import { Programa } from 'src/logica/compilador/Programa';
import { Consola } from 'src/logica/compilador/Consola';
import { Globals } from './globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  version: string;
  fileToUpload: File;
  programa: Programa;

  constructor(public globals: Globals) {
    this.version = "[v0.3.0]";
  }

  ngOnInit(): void {
    this.soportaApiFile();
    this.programa = new Programa();
  }

  cargar(files: FileList) {
    this.fileToUpload = files.item(0);
    let tipoTexto = /text.*/; // solo archivos de texto
    if (this.fileToUpload.type.match(tipoTexto))
      this.cargarPrograma();
  }

  /**
   * Metodo ASINCRONO que lee el fichero subido por el usuario y lo convierte en un programa
   * entendible por el interprete. Tambien limpia la consola.
   */
  private async cargarPrograma() {
    try {
      let parser = new Parser(this.fileToUpload);
      Consola.getInstance().clean();
      this.programa = await parser.read();
    } catch (e) {
      throw new Error("No se ha podido leer el archivo especificado.");
    }
  }
  
  soportaApiFile() {
    var pTexto = "";
    var soporta = false;

    if (window.File && window.FileReader && window.FileList && window.Blob) {
      soporta = true;
      pTexto = "- Este navegador soporta API File.";
    }
    else
      pTexto = "- Este navegador no soporta API File."
        + " El programa no puede funcionar correctamente.";

    return soporta;
  }
}
