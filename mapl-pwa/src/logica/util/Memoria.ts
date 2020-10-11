import { VariableDataType } from './DataTypes';
import { AbstractDataSegmentZone } from './SegmentoDatos';

export class Memory extends AbstractDataSegmentZone {
    /**
     * ...
     * 
     * @param dt 
     * @param instructionSize 
     */
    store(address: number, variable: VariableDataType): void {
        this.dataSegment.add(variable, address);
    }

    /**
     * ...
     * 
     * @param instructionSize tamaño de la instruccion
     * @returns DataType que expulsa
     */
    load(instructionSize: number, address: number): VariableDataType {
        let value = this.dataSegment.get(address);

        if (value === undefined)
            throw new Error("Se lee una zona de memoria que no ha sido inicializada (dir" + address 
                + "). Se introducirá basura en la pila.");
        else if (!(value instanceof VariableDataType))
            throw new Error("Se lee una zona de memoria que no contiene una variable (dir" + address + ").");

        // La posicion a la que accedemos contiene una variable. Pasamos a comprobar los tipos
        let variable = this.dataSegment.get(address) as VariableDataType;
        if (variable.size > instructionSize)
            throw new Error("La lectura transfiere menos bytes de los que tiene '" + variable.name + "'. La variable tiene "
                + variable.size + " y se han leído " + instructionSize + " por lo que se introduzirá basura en la pila.");
        else if (variable.size < instructionSize)
            throw new Error("La lectura transfiere más bytes de los que tiene '" + variable.name + "'. La variable tiene "
                + variable.size + " y se han leído " + instructionSize + " por lo que se introduzirá basura en la pila.");

        return variable;
    }
}