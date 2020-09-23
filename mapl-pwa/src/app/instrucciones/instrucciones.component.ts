import { ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Parser } from 'src/logica/Parser';
import { Linea, Programa } from 'src/logica/Programa';


@Component({
  selector: 'app-instrucciones',
  templateUrl: './instrucciones.component.html',
  styleUrls: ['./instrucciones.component.css']
})
export class InstruccionesComponent implements OnInit {
  fileToUpload: File;
  programa: Programa;

  // define las columnas mostradas y establece su orden de aparicion
  displayedColumns: string[] = ['numeroInstruccion', 'contenido']; 
  dataSource: Linea[];

  constructor(private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void { 
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

  recargarPrograma() {}

  ejecutar() {
    if (this.programa != null)
      this.programa.ejecutar();
  }

  ejecutarInstruccion() {
    if (this.programa != null)
      this.programa.ejecutarSiguienteInstruccion();
  }
}
