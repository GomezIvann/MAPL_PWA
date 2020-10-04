import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Programa } from 'src/logica/compilador/Programa';


@Component({
  selector: 'app-instrucciones',
  templateUrl: './instrucciones.component.html',
  styleUrls: ['./instrucciones.component.css']
})
export class InstruccionesComponent implements OnInit {
  @Input() programa: Programa; // Lo recibe del componente padre app.component

  // Define las columnas mostradas y establece su orden de aparicion
  displayedColumns: string[];

  constructor() { }

  ngOnInit(): void { 
    this.displayedColumns = ["numeroInstruccion", "contenido"];
  }

  recargarPrograma() {}

  ejecutar() {
    this.programa.ejecutar();
  }

  ejecutarInstruccion() {
    this.programa.ejecutarSiguienteInstruccion();
  }
}
