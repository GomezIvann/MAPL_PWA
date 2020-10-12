/**
 * Representa cada linea de texto del fichero leido.
 */
export class Linea {
    contenido: string;
    numeroInstruccion: string; // Si no esta asociada a una instruccion es ""

    constructor(contenido: string, numeroInstruccion = "") {
        this.contenido = contenido;
        this.numeroInstruccion = numeroInstruccion;
    }
    print(): string {
        return this.numeroInstruccion + this.contenido + "\n";
    }
}