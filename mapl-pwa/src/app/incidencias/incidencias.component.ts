import { Component, OnInit } from '@angular/core';
import { Logger } from 'src/logica/util/Logger';

@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.component.html',
  styleUrls: ['./incidencias.component.css']
})
export class IncidenciasComponent implements OnInit {
  logger: Logger;

  constructor() {}

  ngOnInit(): void {
    this.logger = Logger.getInstance();
  }

}
