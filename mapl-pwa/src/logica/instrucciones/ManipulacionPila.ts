import { AddressDataType, ByteDataType, FloatDataType, IntegerDataType, PrimitiveDataType, PrimitiveSizes, VariableDataType } from '../util/DataTypes';
import { Memory } from '../segmentoDatos/Memoria';
import { Stack } from '../segmentoDatos/Stack';
import { InstruccionAddress, InstruccionByte, InstruccionFloat, InstruccionInteger, InstruccionConCteInterface } from './Instruccion';
import { Lenguaje } from '../compilador/Lenguaje';


/**
 * -----------------------------------------------------
 * ----------------------PUSH---------------------------
 * -----------------------------------------------------
 */
export class Push extends InstruccionInteger implements InstruccionConCteInterface {
    pdt: PrimitiveDataType;

    constructor(numeroLinea: number, cte: string) {
        super(numeroLinea);
        if (cte.toUpperCase() !== Lenguaje.REGISTRO_BP)
            this.setConstante(cte);
    }

    execute(stack: Stack, memory: Memory): void {
        if (this.pdt === undefined)
            this.pdt = new AddressDataType(stack.getBP());

        stack.push(this.pdt, this.getSize());
    }
    setConstante(cte: string): void {
        try {
            /**  
             * +cte: para convertir una cadena que contiene un numero en un numero
             * En caso de contener un caracter no numerico devuelve NaN
             */
            this.pdt = new IntegerDataType(+cte);
        }
        catch (err) {
            throw new Error(err.message + " En su lugar, se encontró '" + cte + "'.");
        }
    }
}
export class Pushf extends InstruccionFloat implements InstruccionConCteInterface {
    pdt: PrimitiveDataType;

    constructor(numeroLinea: number, cte: string) {
        super(numeroLinea);
        this.setConstante(cte);
    }

    execute(stack: Stack, memory: Memory): void {
        stack.push(this.pdt, this.getSize());
    }
    setConstante(cte: string): void {
        try {
            this.pdt = new FloatDataType(+cte);
        }
        catch (err) {
            throw new Error(err.message + " En su lugar, se encontró '" + cte + "'.");
        }
    }
}
export class Pushb extends InstruccionByte implements InstruccionConCteInterface {
    pdt: PrimitiveDataType;

    constructor(numeroLinea: number, cte: string) {
        super(numeroLinea);
        this.setConstante(cte);
    }

    execute(stack: Stack, memory: Memory): void {
        stack.push(this.pdt, this.getSize());
    }
    setConstante(cte: string): void {
        try {
            this.pdt = new ByteDataType(+cte);
        }
        catch (err) {
            throw new Error(err.message + " En su lugar, se encontró '" + cte + "'.");
        }
    }
}
export class Pusha extends InstruccionAddress implements InstruccionConCteInterface {
    pdt: PrimitiveDataType;

    constructor(numeroLinea: number, cte: string) {
        super(numeroLinea);
        if (cte.toUpperCase() !== Lenguaje.REGISTRO_BP)
            this.setConstante(cte);
    }

    execute(stack: Stack, memory: Memory): void {
        if (this.pdt === undefined)
            this.pdt = new AddressDataType(stack.getBP());

        stack.push(this.pdt, this.getSize());
    }
    setConstante(cte: string): void {
        try {
            this.pdt = new AddressDataType(+cte);
        }
        catch (err) {
            throw new Error(err.message + " En su lugar, se encontró '" + cte + "'.");
        }
    }
}
/**
 * ----------------------------------------------------
 * ----------------------LOAD--------------------------
 * ----------------------------------------------------
 */
export class Load extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let address = stack.pop(PrimitiveSizes.ADDRESS).value;
        let variable = memory.load(this.getSize(), address);
        stack.push(variable.value, this.getSize());
    }
}
export class Loadf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let address = stack.pop(PrimitiveSizes.ADDRESS).value;
        let variable = memory.load(this.getSize(), address);
        stack.push(variable.value, this.getSize());
    }
}
export class Loadb extends InstruccionByte {
    execute(stack: Stack, memory: Memory): void {
        let address = stack.pop(PrimitiveSizes.ADDRESS).value;
        let variable = memory.load(this.getSize(), address);
        stack.push(variable.value, this.getSize());
    }
}
/**
 * ----------------------------------------------------
 * ----------------------STORE-------------------------
 * ----------------------------------------------------
 */
export class Store extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value = stack.pop(this.getSize());
        let address = stack.pop(PrimitiveSizes.ADDRESS).value;
        let vt: VariableDataType = new VariableDataType("Var" + address, value, value.size);
        memory.store(address, vt);
    }
}
export class Storef extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value = stack.pop(this.getSize());
        let address = stack.pop(PrimitiveSizes.ADDRESS).value;
        let vt: VariableDataType = new VariableDataType("Var" + address, value, value.size);
        memory.store(address, vt);
    }
}
export class Storeb extends InstruccionByte {
    execute(stack: Stack, memory: Memory): void {
        let value = stack.pop(this.getSize());
        let address = stack.pop(PrimitiveSizes.ADDRESS).value;
        let vt: VariableDataType = new VariableDataType("Var" + address, value, value.size);
        memory.store(address, vt);
    }
}
/**
 * ----------------------------------------------------
 * ----------------------POP---------------------------
 * ----------------------------------------------------
 */
export class Pop extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        stack.pop(this.getSize());
    }
}
export class Popf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        stack.pop(this.getSize());
    }
}
export class Popb extends InstruccionByte {
    execute(stack: Stack, memory: Memory): void {
        stack.pop(this.getSize());
    }
}
/**
 * ----------------------------------------------------
 * ----------------------DUP---------------------------
 * ----------------------------------------------------
 * En Javascript los objetos se pasan por referencia, es decir:
 *      let dt = stack.pop(this.getInstructionSize());
 *      let copy = dt;
 * si modificamos un valor de copy (ej. copy.size = 200) tambien se modificaría en dt.
 * Para que dup funcione correctamente y no tengamos guardadas dos referencias al mismo objeto
 * se hace necesario clonar el primero de ellos, de lo cual se encarga el siguiente metodo:
 *       Object.assign(Object.create(Object.getPrototypeOf(dt)), dt)
 * Así es como funciona:
 *      1. Object.create () crea un nuevo objeto y Object.getPrototypeOf() obtiene la cadena de prototipos de la instancia original 
 *         y los agrega al objeto recién creado.
 *      2. Object.assign () hace lo que hemos visto anteriormente, que es copiar (superficialmente) las variables de instancia 
 *         en el objeto recién creado.
 * Actualmente es la unica forma de clonar un objeto manteniendo la clase original.
 */
export class Dup extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let dt = stack.pop(this.getSize());
        let copy = Object.assign(Object.create(Object.getPrototypeOf(dt)), dt);
        stack.push(dt, this.getSize());
        stack.push(copy, this.getSize());
    }
}
export class Dupf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let dt = stack.pop(this.getSize());
        let copy = Object.assign(Object.create(Object.getPrototypeOf(dt)), dt);
        stack.push(dt, this.getSize());
        stack.push(copy, this.getSize());
    }
}
export class Dupb extends InstruccionByte {
    execute(stack: Stack, memory: Memory): void {
        let dt = stack.pop(this.getSize());
        let copy = Object.assign(Object.create(Object.getPrototypeOf(dt)), dt);
        stack.push(dt, this.getSize());
        stack.push(copy, this.getSize());
    }
}