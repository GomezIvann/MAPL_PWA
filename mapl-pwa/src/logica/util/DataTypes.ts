/**
 * Representa los tipos de datos que se pueden almacenar en el segmento de datos. Son 2:
 *      1. Variables.
 *      2. Datos Primitivos (Integer, Float, Byte y Address).
 */
export abstract class DataType {
    size: number; // Tamaño del dato.
}

/**
 * Variables almacenadas en memoria por el programa (store & load).
 * Su tamaño (size) viene determinado por el del tipo de dato que almacena dentro.
 */
export class VariableDataType extends DataType {
    value: PrimitiveDataType; // El valor de las variables en memoria es un tipo primitivo.
    name: string; // Nombre de la variable.

    constructor(name: string, data: PrimitiveDataType) {
        super();
        this.name = name;
        this.value = data;
        this.size = data.size;
    }
    toString() { return this.name + " ("+this.value.value+")"; }
}

/**
 * Datos de tipos primitivos que usan los programas del compilador. Cada uno de estos datos tiene asociado un tamaño (size).
 * Pueden ser:
 *      - Entero (Integer o int): 2 bytes.
 *      - Flotantes (Float): 4 bytes.
 *      - Char (Byte):  1 byte. 
 *      - Dirección/puntero (Address): 2 bytes.
 */
export abstract class PrimitiveDataType extends DataType {
    value: string;

    constructor(value: number) {
        super();
        this.setValue(value);
    }

    /** 
     * Comprueba si el valor pasado como parametro es del tipo que debe ser. 
     * Ejemplo de funcionamiento: 5.4 no es integer, es float, luego retorna false
     */
    abstract setValue(value: number): void;
    toString() { return this.value; }
}
/**
 * Posibles tamaños de los datos
 */
export enum PrimitiveSizes {
    FLOAT = 4,
    INTEGER = 2,
    ADDRESS = 2,
    BYTE = 1
}
export class IntegerDataType extends PrimitiveDataType {
    constructor(value: number) {
        super(value);
        this.size = PrimitiveSizes.INTEGER;
    }
    setValue(value: number): void {
        if (!Number.isInteger(value))
            throw new Error("El valor no es un número entero.");
            
        this.value = value.toString();
    }
}
export class FloatDataType extends PrimitiveDataType {
    constructor(value: number) {
        super(value);
        this.size = PrimitiveSizes.FLOAT;
    }
    setValue(value: number): void {
        if (isNaN(value))
            throw new Error("El valor no es un número real.");
            
        this.value = value.toString();
    }
}
export class ByteDataType extends PrimitiveDataType {
    constructor(value: number) {
        super(value);
        this.size = PrimitiveSizes.BYTE;
    }
    setValue(value: number): void {
        if (!Number.isInteger(value))
            throw new Error("El valor de la instrucción no es un número entero.");
        
        this.value = String.fromCharCode(value);
    }
}
export class AddressDataType extends PrimitiveDataType {
    constructor(value: number) {
        super(value);
        this.size = PrimitiveSizes.ADDRESS;
    }
    setValue(value: number): void {
        if (!Number.isInteger(value))
            throw new Error("El valor de la instrucción no es una dirección de memoria (entero o BP).");
        
        this.value = value.toString();
    }
}