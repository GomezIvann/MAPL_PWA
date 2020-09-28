import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Stack } from 'src/logica/util/Stack';

@Component({
  selector: 'app-pila',
  templateUrl: './pila.component.html',
  styleUrls: ['./pila.component.css']
})
export class PilaComponent implements OnInit {
  @Input() pila: Stack;

  constructor() { }
  ngOnInit(): void { }
}
