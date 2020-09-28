import { ChangeDetectorRef, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Linea, Programa } from 'src/logica/compilador/Programa';


@Component({
  selector: 'app-instrucciones',
  templateUrl: './instrucciones.component.html',
  styleUrls: ['./instrucciones.component.css']
})
export class InstruccionesComponent implements OnInit {
  @Input() programa: Programa; // lo recibe del componente padre app.component

  // define las columnas mostradas y establece su orden de aparicion
  displayedColumns: string[];
  @Input() dataSource: Linea[];

  constructor(private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void { 
    this.displayedColumns = ['numeroInstruccion', 'contenido'];
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
