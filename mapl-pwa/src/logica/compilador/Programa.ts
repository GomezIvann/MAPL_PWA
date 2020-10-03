import { Instruccion } from '../instrucciones/Instruccion';
import { Stack } from '../util/Stack';
import { Label } from './Label';

/**
 * Representa el codigo (instrucciones) del archivo cargado por el usuario
 */
export class Programa {
    codigo: Instruccion[]; // conjunto de instrucciones que forman el programa
    labels: Label[]; // etiquetas del programa
    texto: Linea[]; // texto del programa
    pila: Stack; // pila del programa
    iActual: number; // siguiente instruccion a ejecutar

    constructor() {
        this.codigo = [];
        this.labels = [];
        this.texto = [];
        this.pila = new Stack();
        this.iActual = 0;
    }

    /** 
     * Ejecuta todo el codigo, desde la instruccion actual hasta el final del programa (halt)
     */
    ejecutar() {
        var err: boolean;
        while (this.iActual < this.codigo.length){
            this.ejecutarSiguienteInstruccion();
        }
        this.finDeEjecucion();
    }

    /**
     * Ejecuta la instruccion actual, determinada por iActual.
     */
    ejecutarSiguienteInstruccion()  {
        if (this.iActual < this.codigo.length) {
            try {
                this.codigo[this.iActual].execute(this.pila);
                this.iActual++;
            }
            catch (err) {
                throw new Error("Línea " +  this.codigo[this.iActual].numero + ". "+ err);
            }
        }
        else
            this.finDeEjecucion();
    }
    private finDeEjecucion(): void {
        this.iActual = 0;
        alert("Fin de la ejecución.");
    }

    /**
     * Busca una etiqueta por el nombre
     * @param nombre 
     */
    getLabelByNombre(nombre: string): Label {
        return this.labels.find(label => label.nombre === nombre);
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