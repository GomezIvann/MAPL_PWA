import { ByteDataType, FloatDataType, IntegerDataType } from '../util/DataTypes';
import { Stack } from '../util/Stack';
import { InstruccionByte, InstruccionFloat, InstruccionInteger } from './Instruccion';
import { Consola } from '../compilador/Consola';
import { Memory } from '../util/Memoria';
import { CadenaInb } from '../util/CadenaInb';

/**
 * --------------------------------------------------- 
 * ----------------------IN---------------------------
 * ---------------------------------------------------
 */
export class In extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        var insertedValue;
        do {
            insertedValue = +prompt("[in] Escriba un número entero:");
        }
        while (!Number.isSafeInteger(insertedValue));
        let dt = new IntegerDataType(insertedValue);
        stack.push(dt, this.getInstructionSize());

        // Mostramos el entero por consola
        Consola.getInstance().addOutput("Escriba un entero: " + dt.value);
    }
}
export class Inf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        var insertedValue;
        do {
            insertedValue = +prompt("[in] Escriba un número real:");
        }
        while (isNaN(insertedValue));
        let dt = new FloatDataType(insertedValue);
        stack.push(dt, this.getInstructionSize());

        // Mostramos el real por consola
        Consola.getInstance().addOutput("Escriba un real: " + dt.value);
    }
}
export class Inb extends InstruccionByte {
    cadena: CadenaInb;
    
    constructor(numeroLinea: string){
        super(numeroLinea);
        this.cadena = CadenaInb.getInstance();
    }
    execute(stack: Stack, memory: Memory): void {
        if (this.cadena.isVacia()){
            let insertedValue = prompt("[in] Escriba una cadena de caracteres (cada inb posterior insertará uno de ellos):");
            insertedValue = insertedValue.trim() + "\n"; // Insertamos un salto de linea como delimitador
            this.cadena.setValue(insertedValue.split("").reverse()); // para comenzar insertando por atras
            let dt = new ByteDataType(this.cadena.getChar().charCodeAt(0));
            stack.push(dt, this.getInstructionSize());

            // Mostramos la cadena completa por consola
            Consola.getInstance().addOutput("Escriba una cadena: " + insertedValue.trim());
        }
        else {
            let dt = new ByteDataType(this.cadena.getChar().charCodeAt(0));
            stack.push(dt, this.getInstructionSize());
        }
    }
}
/**
 * ---------------------------------------------------
 * ----------------------OUT--------------------------
 * ---------------------------------------------------
 */
export class Out extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let value = stack.pop(this.getInstructionSize()).value;
        Consola.getInstance().addOutput(value);
    }
}
export class Outf extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let value = stack.pop(this.getInstructionSize()).value;
        Consola.getInstance().addOutput(value);
    }
}
export class Outb extends InstruccionByte {
    execute(stack: Stack, memory: Memory): void {
        let value = stack.pop(this.getInstructionSize()).value;
        Consola.getInstance().addOutput(value);
    }
}