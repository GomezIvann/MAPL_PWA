import { Component, OnInit } from '@angular/core';
import { Parser } from 'src/logica/Parser';
import { Program } from 'src/logica/Program';

@Component({
  selector: 'app-instrucciones',
  templateUrl: './instrucciones.component.html',
  styleUrls: ['./instrucciones.component.css']
})
export class InstruccionesComponent implements OnInit {
  fileToUpload: File;
  program: Program;

  constructor() {}

  ngOnInit(): void {
  }

  cargar(files: FileList) {
    this.fileToUpload = files.item(0);
    let reader = new FileReader();
    let tipoTexto = /text.*/; // solo archivos de texto

    if (this.fileToUpload.type.match(tipoTexto)) {
      reader.onload = (e) => {
        const content = reader.result.toString().trim();
        document.getElementById("codeTextArea").innerHTML = content;
      }
      reader.readAsText(this.fileToUpload);

      // Leemos y cargamos el programa
      let parser = new Parser(this.fileToUpload);
      this.program = parser.read();
    }
  }

  ejecutar() {
    this.program.run();
  }
}
