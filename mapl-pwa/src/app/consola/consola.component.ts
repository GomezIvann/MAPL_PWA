import { Component, OnInit } from '@angular/core';
import { Consola } from 'src/logica/util/Consola';

@Component({
  selector: 'app-consola',
  templateUrl: './consola.component.html',
  styleUrls: ['./consola.component.css']
})
export class ConsolaComponent implements OnInit {
  consola: Consola;
  
  constructor() { }

  ngOnInit(): void {
    this.consola = Consola.getInstance();
  }

  limpiar() {
    this.consola.clean();
  }
}
