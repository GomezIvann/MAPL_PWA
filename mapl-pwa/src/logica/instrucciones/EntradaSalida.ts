import { Stack } from '../Stack';
import { Instruccion } from './Instruccion';

export class In extends Instruccion {
	execute(stack: Stack<number>) {
        var selection;
        do {
            selection = parseInt(prompt("[in] Escriba un número entero:"), 10);
        }
        while(isNaN(selection));
        stack.push(parseInt(selection));
    }
}
export class Out extends Instruccion {
    execute(stack: Stack<number>) {
        let value = stack.pop();
        document.getElementById("consola").innerHTML += "> " +value+ "\n";
    }
}