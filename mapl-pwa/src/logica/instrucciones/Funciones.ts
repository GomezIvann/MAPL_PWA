import { Programa } from '../compilador/Programa';
import { IntegerDataType, ParametroVariable, PrimitiveDataType, PrimitiveSizes, VariableDataType } from '../util/DataTypes';
import { Stack, StackFrame } from '../segmentoDatos/Stack';
import { Memory } from '../segmentoDatos/Memoria';
import { Instruccion, InstruccionLabel } from './Instruccion';
import { Funcion } from '../compilador/Funcion';

/**
 * -----------------------------------------------------
 * ------------------------CALL-------------------------
 * -----------------------------------------------------
 */
export class Call extends InstruccionLabel {
    funcion: Funcion;

    execute(stack: Stack, memory: Memory): void {
        let returnDir: IntegerDataType  = new IntegerDataType(+this.numero);
        let lastBP: IntegerDataType  = new IntegerDataType(+stack.getBP());

        // Convertimos la cima de la pila en parametros de la funcion, de acuerdo a <cte3> de RET
        stack.pushAsParameters(this.funcion.sizeParams);

         // Creamos el Stack Frame y lo insertamos en la pila
        let sf: StackFrame = new StackFrame(returnDir, lastBP);
        stack.pushStackFrame(sf);
        this.programa.jumpTo(this.label.primeraInstruccion); // La ejecucion salta al inicio de la funcion
    }
}
/**
 * -----------------------------------------------------
 * -----------------------ENTER-------------------------
 * -----------------------------------------------------
 */
export class Enter extends Instruccion {
    cte: number;

    constructor(numeroLinea: number, cte: string) {
        super(numeroLinea);
        this.setConstante(+cte);
    }

    execute(stack: Stack, memory: Memory): void {
        stack.allocateStackZone(this.cte);
    }

    setConstante(cte: number): void {
        if (!Number.isSafeInteger(cte))
            throw new Error("Se esperaba un número entero.");

        this.cte = cte;
    }
}
/**
 * -----------------------------------------------------
 * ------------------------RET--------------------------
 * -----------------------------------------------------
 */
export class Ret extends Instruccion {
    private _programa: Programa;

    cte1: number; // tamaño del valor de retorno (0 si no hay)
    cte2: number; // tamaño de las variables locales de la función
    cte3: number; // tamaño de los parámetros de la función

    constructor(numeroInstruccion: number, programa: Programa, ctes: string[]){
		super(numeroInstruccion);
        this._programa = programa;
        this.setCtes(ctes);
    }

    /**
     * Da valor a las constantes de RET y hace las comprobaciones oportunas en cada caso.
     * @param ctes
     */
    private setCtes(ctes: string[]): void {
        if (ctes.length === 1) {
            this.cte1 = 0;
            this.cte2 = 0;
            this.cte3 = 0;
        }
        else if (ctes.length === 3) {
            if (!Number.isSafeInteger(+ctes[0]) || !Number.isSafeInteger(+ctes[1]) || !Number.isSafeInteger(+ctes[2]))
                throw new Error("Los parámetros de la instrucción RET tienen que ser enteros.");
    
            this.setCte1(+ctes[0]);
            this.cte2 = +ctes[1];
            this.cte3 = +ctes[2];
        }
        else
            throw new Error("Los parámetros de la instrucción RET no son correctos.");
    }

    private setCte1(cte1: number): void {
        if (cte1 !== 0 && !(<any>Object).values(PrimitiveSizes).includes(cte1))
            throw new Error("El tamaño del valor de retorno (primera constante de RET) debe ser 0, 1, 2 o 4.");

        this.cte1 = cte1;
    }

    execute(stack: Stack, memory: Memory): void {
        let returnedValue: PrimitiveDataType;
        if (this.cte1 > 0) // Saca de la pila el valor de retorno de la funcion, si lo tiene
            returnedValue = stack.pop(this.cte1);

        stack.eraseStackZone(this.cte2); // Elimina la zona de variables locales
        this._programa.jumpTo(stack.popStackFrame(PrimitiveSizes.INTEGER)); // Saca el Stack Frame y coloca IP en la instruccion posterior al CALL
        stack.eraseStackZone(this.cte3); // Elimina la zona de parametros

        if (returnedValue !== undefined) // Si lo tenia, lo vuelve a insertar en la pila al final de la funcion
            stack.push(returnedValue, returnedValue.size);
    }
}