import { ByteDataType, FloatDataType, IntegerDataType } from '../util/DataTypes';
import { Memory } from '../util/Memoria';
import { Stack } from '../util/Stack';
import { InstruccionInteger, InstruccionFloat, InstruccionByte } from './Instruccion';

/**
 * -----------------------------------------------------
 * --------------B2I (Byte To Integer)------------------
 * -----------------------------------------------------
 */
export class B2i extends InstruccionByte {
    execute(stack: Stack, memory: Memory): void {
        let dtByte = stack.pop(this.getSize());
        let dtInteger = new IntegerDataType(dtByte.value);

        // no se hace necesaria la comprobacion de tipos ya que es un valor interno (se presupone correcto)
        stack.push(dtInteger, dtInteger.size);
    }
}
/**
 * -----------------------------------------------------
 * --------------I2F (Integer To Float)-----------------
 * -----------------------------------------------------
 */
export class I2f extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let dtInteger = stack.pop(this.getSize());
        let dtFloat = new FloatDataType(dtInteger.value);
        stack.push(dtFloat, dtFloat.size);
    }
}
/**
 * -----------------------------------------------------
 * --------------I2B (Integer To Byte)------------------
 * -----------------------------------------------------
 */
export class I2b extends InstruccionInteger {
    execute(stack: Stack, memory: Memory): void {
        let dtInteger = stack.pop(this.getSize());
        let dtByte = new ByteDataType(dtInteger.value);
        stack.push(dtByte, dtByte.size);
    }
}
/**
 * -----------------------------------------------------
 * --------------F2I (Float To Integer)-----------------
 * -----------------------------------------------------
 */
export class F2i extends InstruccionFloat {
    execute(stack: Stack, memory: Memory): void {
        let dtFloat = stack.pop(this.getSize());
        let dtInteger = new IntegerDataType(Math.trunc(dtFloat.value));
        stack.push(dtInteger, dtInteger.size);
    }
}