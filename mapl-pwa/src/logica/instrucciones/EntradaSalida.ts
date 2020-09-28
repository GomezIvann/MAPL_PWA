import { ByteDataType, FloatDataType, IntegerDataType } from '../util/DataTypes';
import { Stack } from '../util/Stack';
import { Instruccion, InstruccionByte, InstruccionFloat, InstruccionInteger } from './Instruccion';

/**
 *  ----------------------IN---------------------------
 */
export class In extends InstruccionInteger {
	execute(stack: Stack) {
        var selection;
        do {
            selection = parseInt(prompt("[in] Escriba un número entero:"), 10);
        }
        while(!Number.isSafeInteger(selection));
        let dt = new IntegerDataType(selection);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Inf extends InstruccionFloat {
	execute(stack: Stack) {
        var selection;
        do {
            selection = parseFloat(prompt("[in] Escriba un número real:"));
        }
        while(isNaN(selection));
        let dt = new FloatDataType(selection);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Inb extends InstruccionByte {
	execute(stack: Stack) {
        let selection = prompt("[in] Escriba una cadena de caracteres (cada inb posterior insertará uno de ellos):").trim();
        let letters = selection.split("");
        let dt = new ByteDataType(letters[0].charCodeAt(0));
        stack.push(dt, this.getInstructionSize());
    }
}

/**
 *  ----------------------OUT---------------------------
 */
export class Out extends InstruccionInteger {
    execute(stack: Stack) {
        let value = stack.pop(this.getInstructionSize()).value;
        document.getElementById("consola").innerHTML += "> " +value+ "\n";
    }
}
export class Outf extends InstruccionFloat {
    execute(stack: Stack) {
        let value = stack.pop(this.getInstructionSize()).value;
        document.getElementById("consola").innerHTML += "> " +value+ "\n";
    }
}
export class Outb extends InstruccionByte {
    execute(stack: Stack) {
        let value = stack.pop(this.getInstructionSize()).value;
        document.getElementById("consola").innerHTML += "> " +value+ "\n";
    }
}