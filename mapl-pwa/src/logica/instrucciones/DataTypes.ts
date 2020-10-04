export abstract class DataType {
    size: number;   // Tamaño del dato.
    value: string;  // Valor del dato.

    // Posicion que ocupa en la pila (de ser el ultimo valor insertado, coincidiría con el valor de SP).
    position: number;

    constructor(value: number) {
        this.setValue(value);
        this.position = 0;
    }

    /** 
     * Comprueba si el valor pasado como param es del tipo que debe ser. 
     * ej: 5.4 no es integer, es float return false
     */
    abstract setValue(value: number): void;
}
export class IntegerDataType extends DataType {
    constructor(value: number) {
        super(value);
        this.size = Sizes.INTEGER;
    }
    setValue(value: number): void {
        if (!Number.isInteger(value))
            throw new Error("El valor no es un número entero.");
            
        this.value = value.toString();
    }
}
export class FloatDataType extends DataType {
    constructor(value: number) {
        super(value);
        this.size = Sizes.FLOAT;
    }
    setValue(value: number): void {
        if (isNaN(value))
            throw new Error("El valor no es un número real.");
            
        this.value = value.toString();
    }
}
export class ByteDataType extends DataType {
    constructor(value: number) {
        super(value);
        this.size = Sizes.BYTE;
    }
    setValue(value: number): void {
        if (!Number.isInteger(value))
            throw new Error("El valor de la instrucción no es un número entero.");
        
        this.value = String.fromCharCode(value);
    }
}

/**
 * Posibles tamaños de los datos
 */
export enum Sizes {
    FLOAT = 4,
    INTEGER = 2,
    BYTE = 1
}