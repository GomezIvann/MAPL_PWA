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
            selection = +prompt("[in] Escriba un número entero:");
        }
        while (!Number.isSafeInteger(selection));
        let dt = new IntegerDataType(selection);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Inf extends InstruccionFloat {
    execute(stack: Stack) {
        var selection;
        do {
            selection = +prompt("[in] Escriba un número real:");
        }
        while (isNaN(selection));
        let dt = new FloatDataType(selection);
        stack.push(dt, this.getInstructionSize());
    }
}
export class Inb extends InstruccionByte {
    cadena: CadenaInb;
    
    constructor(numeroLinea:string){
        super(numeroLinea);
        this.cadena = CadenaInb.getInstance();
    }
    execute(stack: Stack) {
        if (this.cadena.vacia()){
            let selection = prompt("[in] Escriba una cadena de caracteres (cada inb posterior insertará uno de ellos):").trim();
            selection += "\n"; // Insertamos un salto de linea como delimitador
            this.cadena.setValue(selection.split("").reverse());
            let dt = new ByteDataType(this.cadena.getChar().charCodeAt(0));
            stack.push(dt, this.getInstructionSize());
        }
        else {
            let dt = new ByteDataType(this.cadena.getChar().charCodeAt(0));
            stack.push(dt, this.getInstructionSize());
        }
    }
}
/**
 * SINGLETON: Cadena comun para las instrucciones Inb (una unica instancia)
 */
export class CadenaInb {
    private static instance: CadenaInb;
    private _value: string[];

    /**
     * Constructor privado para evitar new CadenaInb
     */
    private constructor() { }

    /**
     * Metodo estatico que controla el acceso a la instancia del Singleton.
     *
     * Esta implementaciOn le permite subclasificar la clase Singleton mientras mantiene
     * solo una instancia de cada subclase alrededor.
     */
    public static getInstance(): CadenaInb {
        if (!CadenaInb.instance){
            CadenaInb.instance = new CadenaInb();
            CadenaInb.instance._value = [];
        }
        return CadenaInb.instance;
    }
    setValue(value: string[]) {
        this._value = value;
    }
    getChar(): string {
        return this._value.pop();
    }
    vacia(): boolean {
        return this._value.length === 0;
    }
}

/**
 *  ----------------------OUT---------------------------
 */
export class Out extends InstruccionInteger {
    execute(stack: Stack) {
        let value = stack.pop(this.getInstructionSize()).value;
        document.getElementById("consola").innerHTML += "> " + value + "\n";
    }
}
export class Outf extends InstruccionFloat {
    execute(stack: Stack) {
        let value = stack.pop(this.getInstructionSize()).value;
        document.getElementById("consola").innerHTML += "> " + value + "\n";
    }
}
export class Outb extends InstruccionByte {
    execute(stack: Stack) {
        let value = stack.pop(this.getInstructionSize()).value;
        document.getElementById("consola").innerHTML += "> " + value + "\n";
    }
}