import { Programa } from "src/logica/compilador/Programa";
import { B2i, F2i, I2b, I2f } from 'src/logica/instrucciones/Conversiones';
import { Halt } from "src/logica/instrucciones/Otras";
import { ByteDataType, FloatDataType, IntegerDataType } from "src/logica/util/DataTypes";

describe('Un programa en ejecución', () => {
    let programa: Programa;
    let halt: Halt;

    beforeEach(() => {
        programa = new Programa();
        halt = new Halt(1, programa);
    });

    it('con un char en la pila, al ejecutar la instrucción B2I, lo convierte a entero', () => {
        const instruccion = new B2i(0);
        programa.pila.push(new ByteDataType(97), 1); // "a"
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(97);
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);
    });

    it('con un entero en la pila, al ejecutar la instrucción I2B, lo convierte a byte', () => {
        const instruccion = new I2b(0);
        programa.pila.push(new IntegerDataType(98), 2);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().toString()).toEqual(JSON.stringify("b"));  // "b"
        expect(programa.pila.top()).toBeInstanceOf(ByteDataType);
    });

    it('con un entero en la pila, al ejecutar la instrucción I2F, lo convierte a real', () => {
        const instruccion = new I2f(0);
        programa.pila.push(new IntegerDataType(100), 2);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(100);
        expect(programa.pila.top()).toBeInstanceOf(FloatDataType);
    });

    it('con un real en la pila, al ejecutar la instrucción F2I, lo convierte a entero', () => {
        const instruccion = new F2i(0);
        programa.pila.push(new FloatDataType(14.756), 4);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(14);
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);
    });
});