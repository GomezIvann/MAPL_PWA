/**
 * Ej. inicio: <Label>
 *      dup    <primeraInstruccion>     
 *      ...
 *      jmp inicio
 */
export class Label {
    nombre: string;
    /**
     * Numero que determina cual es la siguiente 
     * instruccion tras el Label
     */ 
    primeraInstruccion: number;

    constructor(nombre: string, primeraInstruccion: number) {
        this.nombre = nombre;
        this.primeraInstruccion = primeraInstruccion-1;
    }
}