import { Instruccion } from './Instruccion';

export class In extends Instruccion {
	execute() {
        let value = prompt("[in] Escriba un número entero:");
        return value;
    }
}
export class Out extends Instruccion {
    execute() {
        throw new Error('Method not implemented.');
    }
}