import { Instruccion } from '../instrucciones/Instruccion';
import { Stack } from '../util/Stack';

/**
 * Representa el codigo (instrucciones) del archivo cargado por el usuario
 */
export class Programa {
    codigo: Instruccion[]; // conjunto de instrucciones que forman el programa
    texto: Linea[]; // texto del programa
    pila: Stack; // pila del programa

    private iActual: number; // siguiente instruccion a ejecutar

    constructor() {
        this.codigo = [];
        this.texto = [];
        this.pila = new Stack();
        this.iActual = 0;
    }
    ejecutar() {
        for (let i = this.iActual; i < this.codigo.length; i++) {
            try {
                this.codigo[i].execute(this.pila);
            }
            catch (err) {
                this.hasErrors(this.codigo[i].numero, err);
            }
        }
        this.finDeEjecucion();
    }
    ejecutarSiguienteInstruccion() {
        if (this.iActual < this.codigo.length) {
            try {
                this.codigo[this.iActual].execute(this.pila);
                this.iActual++;
            }
            catch (err) {
                this.hasErrors(this.codigo[this.iActual].numero, err);
            }
        }
        else
            this.finDeEjecucion();
    }
    private finDeEjecucion() {
        this.iActual = 0;
        alert("Fin de la ejecución.");
    }
    private hasErrors(numeroInstruccion: string, err) {
        throw new Error("Línea " + numeroInstruccion + ": " + err.message);
    }
}

/**
 * Representa cada linea del fichero leido
 */
export class Linea {
    contenido: string;
    numeroInstruccion: string;

    constructor(contenido: string, numeroInstruccion = "") {
        this.contenido = contenido;
        this.numeroInstruccion = numeroInstruccion;
    }
    print(): string {
        return this.numeroInstruccion + this.contenido + "\n";
    }
}