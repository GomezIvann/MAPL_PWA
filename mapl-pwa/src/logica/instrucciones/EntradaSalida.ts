import { ByteDataType, DataType, FloatDataType, IntegerDataType } from '../util/DataTypes';
import { Stack } from '../util/Stack';
import { Instruccion } from './Instruccion';

export class In extends Instruccion {
	execute(stack: Stack<DataType>) {
        var selection;
        do {
            selection = parseInt(prompt("[in] Escriba un número entero:"), 10);
        }
        while(Number.isSafeInteger(selection));
        let dt = new IntegerDataType(selection);
        stack.push(dt);
    }
}
export class Inf extends Instruccion {
	execute(stack: Stack<DataType>) {
        var selection;
        do {
            selection = parseFloat(prompt("[in] Escriba un número real:"));
        }
        while(isNaN(selection));
        let dt = new FloatDataType(selection);
        stack.push(dt);
    }
}
export class Inb extends Instruccion {
	execute(stack: Stack<DataType>) {
        var selection = prompt("[in] Escriba una cadena de caracteres (cada inb posterior devolverá uno de ellos):");
        let dt = new ByteDataType(parseInt(selection));
        stack.push(dt);
    }
}
export class Out extends Instruccion {
    execute(stack: Stack<DataType>) {
        let value = stack.pop().value;
        document.getElementById("consola").innerHTML += "> " +value+ "\n";
    }
}