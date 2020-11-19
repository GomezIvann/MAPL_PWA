/**
 * Representa los tipos de datos que se pueden almacenar en el segmento de datos. Son 2:
 *      1. Variables.
 *      2. Datos Primitivos (Integer, Float, Byte y Address).
 */
export abstract class DataType {
    size: number; // Tamaño del dato.

    constructor(size: number) {
        this.size = size;
    }
    abstract informacion(): string;
    protected getTipo(): string {
        let str = "";
        if (this.size === PrimitiveSizes.INTEGER)
            str = "de tipo entero";
        else if (this.size === PrimitiveSizes.FLOAT)
            str = "de tipo byte";
        else if (this.size === PrimitiveSizes.BYTE)
            str = "de tipo byte";
        else if (this.size === PrimitiveSizes.ADDRESS)
            str = "de tipo address/dirección/puntero";
        return str;
    }
}
/**
 * Variables almacenadas en memoria por el programa (store & load).
 * Su tamaño (size) viene determinado por el del tipo de dato que almacena dentro.
 */
export class VariableDataType extends DataType {
    value: PrimitiveDataType; // El valor de las variables en memoria es un tipo primitivo.
    name: string; // Nombre de la variable.

    constructor(name: string, data: PrimitiveDataType, size: number) {
        super(size);
        this.name = name;
        this.value = data;
    }

    toString() {
        if (this.value === undefined)
            return this.name + " (sin inicializar)";

        return this.name + " (" + this.value.toString() + ")";
    }
    informacion(): string {
        if (this.value === undefined)
            return "Variable global '" + this.name + "' " + this.getTipo() + ". Sin inicializar.";

        return "Variable global '" + this.name + "' " + this.getTipo() +". Su valor actual es "+this.value.toString()+".";
    }
}

/**
 * Variables pasadas como parametro a una funcion. Se crean en la instruccion CALL gracias al parametro inferido del RET de la funcion.
 */
export class ParametroVariable extends VariableDataType {
    informacion(): string {
        return "Parámetro '" + this.name + "' " + this.getTipo() +". Su valor actual es "+this.value.toString()+". "+
               "Ha sido inferido a partir de la tercera constante del RET de la funcion.";
    }
}

/**
 * Datos de tipos primitivos que usan los programas del depurador. Cada uno de estos datos tiene asociado un tamaño (size).
 * Pueden ser:
 *      - Entero (Integer o int): 2 bytes.
 *      - Flotantes (Float): 4 bytes.
 *      - Char (Byte):  1 byte. 
 *      - Dirección/puntero (Address): 2 bytes.
 */
export abstract class PrimitiveDataType extends DataType {
    value: number;

    constructor(value: number, size: number) {
        super(size);
        this.setValue(value);
    }

    /** 
     * Comprueba si el valor pasado como parametro es del tipo que debe ser. 
     * Ejemplo de funcionamiento: 5.4 no es integer, es float, luego retorna false
     */
    abstract setValue(value: number): void;
    toString() { return "" + this.value; }
}

/**
 * Posibles tamaños de los datos primitivos.
 */
export enum PrimitiveSizes {
    FLOAT = 4,
    INTEGER = 2,
    ADDRESS = 2,
    BYTE = 1
}

/**
 * DATOS DE TIPO ENTERO
 */
export class IntegerDataType extends PrimitiveDataType {
    constructor(value: number) {
        super(value, PrimitiveSizes.INTEGER);
    }

    setValue(value: number): void {
        if (!Number.isSafeInteger(value))
            throw new Error("Se esperaba un número entero.");

        this.value = value;
    }
    informacion(): string {
        return "Valor de tipo entero = " + this.value + ".";
    }
}

/**
 * DATOS DE TIPO REAL
 */
export class FloatDataType extends PrimitiveDataType {
    constructor(value: number) {
        super(value, PrimitiveSizes.FLOAT);
    }

    setValue(value: number): void {
        if (isNaN(value))
            throw new Error("Se esperaba un número real.");

        this.value = value;
    }
    informacion(): string {
        return "Valor de tipo real = " + this.value + ".";
    }
}

/**
 * DATOS DE TIPO BYTE
 */
export class ByteDataType extends PrimitiveDataType {
    constructor(value: number) {
        super(value, PrimitiveSizes.BYTE);
    }

    setValue(value: number): void {
        if (!Number.isSafeInteger(value))
            throw new Error("Se esperaba un número entero.");

        this.value = value;
    }
    /**
     * JSON.stringify() convierte un objeto o valor de JavaScript en una cadena de texto JSON.
     * Gracias a esto, los caracteres especiales como \n o \t no se interpretan y se muestran como tal.
     */
    toString() {
        let str = String.fromCharCode(this.value);
        return JSON.stringify(str);
    }
    informacion(): string {
        return "Valor de tipo byte = " + this.value + ".";
    }
}

/**
 * DATOS DE TIPO ADDRESS (DIRECCIONES DE MEMORIA O PUNTEROS)
 */
export class AddressDataType extends PrimitiveDataType {
    constructor(value: number) {
        super(value, PrimitiveSizes.ADDRESS);
    }

    setValue(value: number): void {
        if (!Number.isSafeInteger(value))
            throw new Error("Se esperaba una dirección de memoria (entero o BP).");
        else if (value < 0)
            throw new Error("Se esperaba una dirección de memoria positiva.");

        this.value = value;
    }
    informacion(): string {
        return "Valor de tipo address/dirección/puntero = " + this.value + ".";
    }
}