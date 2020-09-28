import { Instruccion } from '../instrucciones/Instruccion';
import { Stack } from '../util/Stack';

/**
 * Representa el codigo (instrucciones) del archivo cargado por el usuario
 */
export class Programa {
    codigo: Instruccion[]; // conjunto de instrucciones que forman el programa
    texto: Linea[]; // texto del programa
    pila: Stack; // pila del programa

    actual: number; // numero de instruccion ejecutándose

    constructor() {
        this.codigo = [];
        this.texto = [];
        this.pila = new Stack();
        this.actual = 0;
    }
    ejecutar() {
        this.codigo.forEach(i => {
            try {
                i.execute(this.pila);
            }
            catch (err) {
                this.hasErrors(i, err);
            }
        });
        alert("Fin de la ejecución.")
    }
    ejecutarSiguienteInstruccion() {
        if (this.actual < this.codigo.length) {
            try {
                this.codigo[this.actual].execute(this.pila);
                this.actual++;
            }
            catch (err) {
                this.hasErrors(this.codigo[this.actual], err);
            }
        }
        else
            alert("Fin de la ejecución.");
    }
    private hasErrors(instruccion: Instruccion, err) {
        throw new Error("Línea " + instruccion.numero + ": " + err.message);
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