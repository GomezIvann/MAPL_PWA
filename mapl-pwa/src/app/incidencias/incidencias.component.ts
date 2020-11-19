import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Incidencia } from 'src/logica/depurador/Incidencia';
import { Logger } from 'src/logica/util/Logger';

@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.component.html',
  styleUrls: ['./incidencias.component.css']
})
export class IncidenciasComponent implements OnInit {

  // Define las columnas mostradas y establece su orden de aparicion
  displayedColumns: string[];
  dataSource: MatTableDataSource<Incidencia>;

  constructor() {
    this.displayedColumns = ["identificador", "tipo", "linea", "descripcion"];
    this.dataSource = new MatTableDataSource<Incidencia>();
  }

  ngOnInit(): void {
    Logger.getInstance().dataAsObservable().subscribe((res) => {
      this.dataSource.data = res;
    });
  }

}
