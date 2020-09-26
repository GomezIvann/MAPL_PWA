import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Instruccion } from '../instrucciones/Instruccion';
import { DataType } from '../util/DataTypes';
import { Stack } from '../util/Stack';

/**
 * Representa el codigo (instrucciones) del archivo cargado por el usuario
 */
export class Programa {
    codigo: Instruccion[]; // conjunto de instrucciones que forman el programa
    texto: Linea[]; // texto del programa
    pila: Stack<DataType>; // pila del programa

    actual: number; // numero de instruccion ejecutándose

    constructor() {
        this.codigo = [];
        this.texto = [];
        this.pila = new Stack<DataType>(1024);
        this.actual = 0;
    }
    ejecutar() {
        this.codigo.forEach(i => i.execute(this.pila));
    }
    ejecutarSiguienteInstruccion() {
        if (this.actual < this.codigo.length) {
            this.codigo[this.actual].execute(this.pila);
            this.actual++;
        }
    }
    retroceder() {
        if (this.actual > 0)
            this.actual--;
    }
}

/**
 * Representa cada linea del fichero leido
 */
export class Linea {
    contenido: string;
    numeroInstruccion: string;

	constructor(contenido: string, numeroInstruccion = ""){
        this.contenido = contenido;
        this.numeroInstruccion = numeroInstruccion;
    }
    print(): string {
        return this.numeroInstruccion + this.contenido + "\n";
    }
}