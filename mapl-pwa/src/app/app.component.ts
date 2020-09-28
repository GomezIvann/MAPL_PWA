import { Component } from '@angular/core';
import { Parser } from 'src/logica/compilador/Parser';
import { Linea, Programa } from 'src/logica/compilador/Programa';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  titulo = 'MAPL - PWA';
  version = '[v0.0.3]';
  fileToUpload: File;
  programa: Programa;
  dataSource: Linea[];

  ngOnInit(): void {
    this.soportaApiFile();
    this.programa = new Programa(); //??
  }

  cargar(files: FileList) {
    this.fileToUpload = files.item(0);
    let tipoTexto = /text.*/; // solo archivos de texto
    if (this.fileToUpload.type.match(tipoTexto))
      this.cargarPrograma();
  }

  /**
   * Metodo ASINCRONO que lee el fichero subido por el usuario y lo convierte en un programa
   * entendible por el interprete
   */
  private async cargarPrograma() {
    try {
      let parser = new Parser(this.fileToUpload);
      this.programa = await parser.read(); // espera a que el parser termine de leer el fichero
      this.dataSource = this.programa.texto; // para luego cargar el codigo en la tabla
    } catch (e) {
      throw new Error("Impossible to parser the specified file.");
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

    console.log(pTexto);
    return soporta;
  }
}
