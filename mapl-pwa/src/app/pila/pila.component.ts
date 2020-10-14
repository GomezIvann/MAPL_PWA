import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataType } from 'src/logica/util/DataTypes';
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
  displayedColumns: string[] = ["address", "value"];
  dataSource = new MatTableDataSource<[DataType, boolean]>();

  constructor() {
  }

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

  /**
   * Controla el rowspan de cada fila de datos del segmento de datos, de acuerdo al size de cada dato,
   * es decir, si el size es 2 (Integer), el rowspan = 2.
   * En caso contrario (que el data segment este vacio), rowspan = 1.
   * 
   * @param dt
   */
  getRowSpan(index: number): number {
    let tuple = DataSegment.getInstance().get(index);

    if (tuple === undefined)
      return 1;
    else if (tuple[0] !== undefined)
      return tuple[0].size;
    else if (tuple[1])
      return 0;
  }
}
