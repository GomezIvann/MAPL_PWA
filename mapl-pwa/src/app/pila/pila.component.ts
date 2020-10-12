import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataType, PrimitiveDataType } from 'src/logica/util/DataTypes';
import { DataSegment } from 'src/logica/util/SegmentoDatos';
import { Stack } from 'src/logica/util/Stack';

@Component({
  selector: 'app-pila',
  templateUrl: './pila.component.html',
  styleUrls: ['./pila.component.css']
})
export class PilaComponent implements OnInit {
  // Lo recibe del componente padre app.component.
  private _pila: Stack;

  // Define las columnas mostradas y establece su orden de aparicion.
  displayedColumns: string[] = ["position", "value"];
  dataSource = new MatTableDataSource<DataType>();

  constructor() {}

  /**
   * Cada vez que el valor de la pila cambie (inyectado por app.component), esto es,
   * al cargar un programa nuevo, "renovamos" la suscripcion a esta.
   */
  @Input() set pila(value: Stack) {
    this._pila = value;
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
    DataSegment.getInstance().data().subscribe((res) => {
      this.dataSource.data = res;
      this.scrollToFondoPila();
    });
  }

  /**
   * Mueve el scroll del contenedor asociada a la pila al fondo del segmento de datos.
   */
  scrollToFondoPila() {
    let div = document.getElementById("div-pila");
    div.scrollTop = div.scrollHeight;
  }
}
