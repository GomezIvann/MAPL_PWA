import { ByteDataType, FloatDataType, IntegerDataType } from '../util/DataTypes';
import { Stack } from '../util/Stack';
import { InstruccionInteger, InstruccionFloat, InstruccionByte } from './Instruccion';

export class B2i extends InstruccionByte {
    execute(stack: Stack) {
        let dtByte = stack.pop(this.getInstructionSize());
        let dtInteger = new IntegerDataType(dtByte.value.charCodeAt(0));
        stack.push(dtInteger, dtInteger.size); // no se hace necesaria la comprobacion de tipos ya que es un valor interno
    }
}
export class I2f extends InstruccionInteger {
    execute(stack: Stack) {
        let dtInteger = stack.pop(this.getInstructionSize());
        let dtFloat = new FloatDataType(parseFloat(dtInteger.value));
        stack.push(dtFloat, dtFloat.size);
    }
}
export class I2b extends InstruccionInteger {
    execute(stack: Stack) {
        let dtInteger = stack.pop(this.getInstructionSize());
        let dtByte = new ByteDataType(parseInt(dtInteger.value));
        stack.push(dtByte, dtByte.size);
    }
}
export class F2i extends InstruccionFloat {
    execute(stack: Stack) {
        let dtFloat = stack.pop(this.getInstructionSize());
        let dtInteger = new IntegerDataType(parseInt(dtFloat.value));
        stack.push(dtInteger, dtInteger.size);
    }
}