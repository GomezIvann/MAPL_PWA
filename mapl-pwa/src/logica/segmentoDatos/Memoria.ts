import { VariableDataType } from '../util/DataTypes';
import { AbstractDataSegmentZone } from './SegmentoDatos';

export class Memory extends AbstractDataSegmentZone {
    private _globalVariablesAddress: number;

    constructor() {
        super();
        this._globalVariablesAddress = 0;
    }

    /**
     * Almacena una variable en la memoria.
     * 
     * @param dt 
     * @param instructionSize 
     */
    store(address: number, variable: VariableDataType): void {
        if (address > this.dataSegment.SIZE)
            throw new Error("Acceso a una zona de memoria no existente (de " + address + " a " + (address + variable.size - 1) + ").");
        else if (!this.isInsertable(address, variable.size))
            throw new Error("Se ha realizado una escritura parcial en memoria libre (dir " + address + ").");

        // Si en esa dir. de memoria hay una variable almacenada ya se 'modifica'...
        if (this.dataSegment.get(address) !== undefined) {
            let storedVariable = this.dataSegment.get(address)[0] as VariableDataType;

            if (variable.size !== storedVariable.size)
                throw new Error("Se escriben más bytes de los que ocupa '" + storedVariable.name + "'. La variable ocupa " + storedVariable.size +
                    " bytes y se están escribiendo " + variable.size + ".");

            // Dado que estamos 'modificando' una variable en memoria, conservamos su nombre
            variable.name = storedVariable.name;
        }
        this.dataSegment.add(variable, address);
    }

    /**
     * Devuelve true si el dato es insertable en la direccion de memoria pasada como parametro.
     * Para que un dato sea insertable ninguna de las posiciones que va a ocupar deben estarlo ya:
     *      - Si en el rango [address, address + tamaño de la variable] hay algun valor del tipo [undefined, true], es que esta ocupada
     *        parcialemente, debe retornar false.
     * Sin embargo, si la direccion coincide con la posicion inicial de una variable (ej. [new IntegerDataType(10), true]) 
     * ya almacenada, el nuevo dato debe sobreescribir al antiguo, sin cambiarle el nombre. 
     * En ese caso debe devolver true.
     * 
     * @param address 
     * @param size 
     */
    private isInsertable(address: number, size: number): boolean {
        // Comienzo de variable ya insertada en memoria > se puede escribir
        if (this.dataSegment.get(address) !== undefined && this.dataSegment.get(address)[1]
            && this.dataSegment.get(address)[0] !== undefined)
            return true;

        for (let i = 0; i < size; i++) {
            if (this.dataSegment.get(address + i) === undefined)
                continue;
            else if (this.dataSegment.get(address + i)[1])
                return false;
        }
        return true;
    }

    /**
     * Reserva espacio de la memoria para una variable global. Lleva la cuenta de donde insertar la variable declarada.
     * 
     * @param dt 
     * @param instructionSize 
     */
    storeGlobalVariable(variable: VariableDataType): void {
        this.store(this._globalVariablesAddress, variable);
        this._globalVariablesAddress += variable.size;
    }

    /**
     * Devuelve la variable almacenada en memoria.
     * 
     * @param instructionSize tamaño de la instruccion
     * @returns DataType que expulsa
     */
    load(instructionSize: number, address: number): VariableDataType {
        let value = this.dataSegment.get(address);

        if (value === undefined) // Posicion vacia
            throw new Error("Se lee una zona de memoria que no ha sido inicializada (dir" + address
                + "). Se introducirá basura en la pila.");
        else if (value[0] === undefined && value[1]) // Lectura parcial (no es la direccion de comienzo de la variable)
            throw new Error("Se ha realizado una lectura parcial en memoria libre (dir" + address + ").");
        else if (!(value[0] instanceof VariableDataType)) // No se lee una variable (generalmente al intentar leer una direccion ocupada por un valor de la pila)
            throw new Error("Se lee una zona de memoria que no contiene una variable (dir" + address + ").");

        /**
         * Llegados a este punto, la posicion a la que accedemos contiene una variable. 
         * Pasamos a realizar la comprobacion de tipos.
         */
        let variable = this.dataSegment.get(address)[0] as VariableDataType;
        if (variable.size > instructionSize)
            throw new Error("La lectura transfiere menos bytes de los que tiene '" + variable.name + "'. La variable tiene "
                + variable.size + " y se han leído " + instructionSize + " por lo que se introduzirá basura en la pila.");
        else if (variable.size < instructionSize)
            throw new Error("La lectura transfiere más bytes de los que tiene '" + variable.name + "'. La variable tiene "
                + variable.size + " y se han leído " + instructionSize + " por lo que se introduzirá basura en la pila.");

        return variable;
    }
}