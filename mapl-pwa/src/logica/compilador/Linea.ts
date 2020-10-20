/**
 * Representa cada linea de texto del fichero leido.
 */
export class Linea {
    contenido: string;
    numeroInstruccion: string; // Si no esta asociada a una instruccion es ""

    constructor(contenido: string, contadorInstrucciones: number = undefined) {
        this.contenido = contenido;

        if (contadorInstrucciones !== undefined)
            this.numeroInstruccion = ("000" + contadorInstrucciones).slice(-4);
        else
            this.numeroInstruccion = "";
    }
    print(): string {
        return this.numeroInstruccion + this.contenido + "\n";
    }
}