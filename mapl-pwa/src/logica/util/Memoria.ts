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
     * ..
     * 
     * @param instructionSize tamaño de la instruccion
     * @returns DataType que expulsa
     */
    load(instructionSize: number, address: number): VariableDataType {
        let returnedValue = this.dataSegment.get(address);

        if (returnedValue === undefined)
            throw new Error("Se ha intentado acceder a una dirección de memoria donde no había ningún valor.");
        else if (returnedValue.size > instructionSize)
            throw new Error("La variable retirada para la instrucción deja en la memoria los últimos bytes de esta sin retirar.");
        else if (returnedValue.size < instructionSize)
            throw new Error("La variable retirada para la instrucción son restos de un otra parcialmente retirada.");

        return this.dataSegment.get(address) as VariableDataType;
    }
}