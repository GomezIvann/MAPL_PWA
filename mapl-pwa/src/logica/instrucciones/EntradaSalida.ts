import { ByteDataType, FloatDataType, IntegerDataType } from './DataTypes';
import { Stack } from '../util/Stack';
import { Instruccion, InstruccionByte, InstruccionFloat, InstruccionInteger } from './Instruccion';
import { Consola } from '../compilador/Consola';

/**
 *  ----------------------IN---------------------------
 */
export class In extends InstruccionInteger {
    execute(stack: Stack) {
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
    execute(stack: Stack) {
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
    
    constructor(numeroLinea:string){
        super(numeroLinea);
        this.cadena = CadenaInb.getInstance();
    }
    execute(stack: Stack) {
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
    isVacia(): boolean {
        return this._value.length === 0;
    }
    clean() {
        this._value = [];
    }
}

/**
 *  ----------------------OUT---------------------------
 */
export class Out extends InstruccionInteger {
    execute(stack: Stack) {
        let value = stack.pop(this.getInstructionSize()).value;
        Consola.getInstance().addOutput(value);
    }
}
export class Outf extends InstruccionFloat {
    execute(stack: Stack) {
        let value = stack.pop(this.getInstructionSize()).value;
        Consola.getInstance().addOutput(value);
    }
}
export class Outb extends InstruccionByte {
    execute(stack: Stack) {
        let value = stack.pop(this.getInstructionSize()).value;
        Consola.getInstance().addOutput(value);
    }
}