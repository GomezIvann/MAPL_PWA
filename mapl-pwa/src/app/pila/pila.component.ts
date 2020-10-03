import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataType } from 'src/logica/instrucciones/DataTypes';
import { Stack } from 'src/logica/util/Stack';

@Component({
  selector: 'app-pila',
  templateUrl: './pila.component.html',
  styleUrls: ['./pila.component.css']
})
export class PilaComponent implements OnInit {
   // Lo recibe del componente padre app.component
  @Input() private _pila: Stack;

  // Define las columnas mostradas y establece su orden de aparicion
  displayedColumns: string[] = ["size", "value"];
  dataSource = new MatTableDataSource<DataType>();

  constructor() {}

  /**
   * Cada vez que el valor de la pila cambie (inyectado por app.component), esto es,
   * al cargar un programa nuevo, "renovamos" la suscripcion a esta.
   */
  @Input() set pila(value: Stack) {
    this._pila = value;
    this.dataSource.data = []; // vaciamos la tabla hasta la ejecucion del programa
    this.refresh();
  }

  get pila(): Stack {
    return this._pila;
  }

  ngOnInit(): void {}

  /**
   * Genera la suscripcion a partir del observable.
   * Modifica los datos de la tabla.
   */
  refresh() {
    this.pila.values().subscribe((res) => {
      this.dataSource.data = res;
    });
  }
}
