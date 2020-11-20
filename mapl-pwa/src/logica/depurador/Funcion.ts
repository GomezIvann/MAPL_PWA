/**
 * Clase encargada de relacionar el parametro <cte3> de RET con 
 * la instruccion CALL para la definicion de parametros de una funcion.
 */
export class Funcion {
    nombre: string;
    sizeParams: number; // <cte3> de la instruccion RET

    constructor (nombre: string) {
        this.nombre = nombre;
        this.sizeParams = 0;
    }
}