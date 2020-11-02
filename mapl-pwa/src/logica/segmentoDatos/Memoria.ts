import { VariableDataType } from '../util/DataTypes';
import { AbstractDataSegmentZone } from './SegmentoDatos';

export class Memory extends AbstractDataSegmentZone {
    /**
     * Almacena una variable en la memoria.
     * 
     * @param dt 
     * @param instructionSize 
     */
    store(address: number, variable: VariableDataType): void {
        if (address > this.dataSegment.SIZE)
            throw new Error("Acceso a una zona de memoria no existente (de "+address+" a "+(address+variable.size-1)+").");
        else if (!this.dataSegment.isInsertable(address, variable.size))
            throw new Error("Se ha realizado una escritura parcial en memoria libre (dir"+address+").");

        this.dataSegment.add(variable, address);
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
            throw new Error("Se ha realizado una lectura parcial en memoria libre (dir" + address +").");
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