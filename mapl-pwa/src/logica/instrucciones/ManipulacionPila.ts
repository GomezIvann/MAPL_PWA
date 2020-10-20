import { AddressDataType, ByteDataType, FloatDataType, IntegerDataType, PrimitiveDataType, PrimitiveSizes, VariableDataType } from '../util/DataTypes';
import { Memory } from '../util/Memoria';
import { Stack } from '../util/Stack';
import { InstruccionAddress, InstruccionByte, InstruccionFloat, InstruccionInteger } from './Instruccion';

/**
 * -----------------------------------------------------
 * ----------------------PUSH---------------------------
 * -----------------------------------------------------
 */
export class Push extends InstruccionInteger {
    cte: string;

    constructor(numeroLinea: number, cte: string){ 
        super(numeroLinea);
        this.cte = cte;
    }
    execute(stack: Stack, memory: Memory): void {
        // +cadena --> para convertir una cadena que contiene un número en un número
        // Solo funciona si la cadena solo contiene caracteres numéricos, de lo contrario, devuelve NaN
        let dt = new IntegerDataType(+this.cte);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Pushf extends InstruccionFloat {
    cte: string;

    constructor(numeroLinea: number, cte: string){ 
        super(numeroLinea);
        this.cte = cte;
    }
    execute(stack: Stack, memory: Memory): void {
        let dt = new FloatDataType(+this.cte);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Pushb extends InstruccionByte {
    cte: string;

    constructor(numeroLinea: number, cte: string){ 
        super(numeroLinea);
        this.cte = cte;
    }
    execute(stack: Stack, memory: Memory): void {
        let dt = new ByteDataType(+this.cte); 
        stack.push(dt, this.getInstructionSize());
    }
}
export class Pusha extends InstruccionAddress {
    cte: string;

    constructor(numeroLinea: number, cte: string){ 
        super(numeroLinea);
        this.cte = cte;
    }
    execute(stack: Stack, memory: Memory): void {
        let dt = new AddressDataType(+this.cte); 
        stack.push(dt, this.getInstructionSize());
    }
}
/**
 * ----------------------------------------------------
 * ----------------------LOAD--------------------------
 * ----------------------------------------------------
 */
export class Load extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let address = parseInt(stack.pop(PrimitiveSizes.ADDRESS).value);
        let variable = memory.load(this.getInstructionSize(), address);
        stack.push(variable.value, this.getInstructionSize());
    }
}
export class Loadf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let address = parseInt(stack.pop(PrimitiveSizes.ADDRESS).value);
        let variable = memory.load(this.getInstructionSize(), address);
        stack.push(variable.value, this.getInstructionSize());
    }
}
export class Loadb extends InstruccionByte {
    execute(stack: Stack, memory: Memory): void {
        let address = parseInt(stack.pop(PrimitiveSizes.ADDRESS).value);
        let variable = memory.load(this.getInstructionSize(), address);
        stack.push(variable.value, this.getInstructionSize());
    }
}
/**
 * ----------------------------------------------------
 * ----------------------STORE-------------------------
 * ----------------------------------------------------
 */
export class Store extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value = stack.pop(this.getInstructionSize());
        let address = parseInt(stack.pop(PrimitiveSizes.ADDRESS).value);
        let vt: VariableDataType = new VariableDataType("Var"+address, value);
        memory.store(address, vt);
    }
}
export class Storef extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value = stack.pop(this.getInstructionSize());
        let address = parseInt(stack.pop(PrimitiveSizes.ADDRESS).value);
        let vt: VariableDataType = new VariableDataType("Var"+address, value);
        memory.store(address, vt);
    }
}
export class Storeb extends InstruccionByte {
    execute(stack: Stack, memory: Memory): void {
        let value = stack.pop(this.getInstructionSize());
        let address = parseInt(stack.pop(PrimitiveSizes.ADDRESS).value);
        let vt: VariableDataType = new VariableDataType("Var"+address, value);
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
        stack.pop(this.getInstructionSize());
    }
}
export class Popf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        stack.pop(this.getInstructionSize());
    }
}
export class Popb extends InstruccionByte {
    execute(stack: Stack, memory: Memory): void {
        stack.pop(this.getInstructionSize());
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
        let dt = stack.pop(this.getInstructionSize());
        let copy = Object.assign(Object.create(Object.getPrototypeOf(dt)), dt);
        stack.push(dt, this.getInstructionSize());
        stack.push(copy, this.getInstructionSize());
    }
}
export class Dupf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let dt = stack.pop(this.getInstructionSize());
        let copy = Object.assign(Object.create(Object.getPrototypeOf(dt)), dt);
        stack.push(dt, this.getInstructionSize());
        stack.push(copy, this.getInstructionSize());
    }
}
export class Dupb extends InstruccionByte {
    execute(stack: Stack, memory: Memory): void {
        let dt = stack.pop(this.getInstructionSize());
        let copy = Object.assign(Object.create(Object.getPrototypeOf(dt)), dt);
        stack.push(dt, this.getInstructionSize());
        stack.push(copy, this.getInstructionSize());
    }
}