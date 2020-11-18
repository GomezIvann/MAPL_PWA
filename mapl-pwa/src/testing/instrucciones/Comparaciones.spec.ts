import { Consola } from 'src/logica/compilador/Consola';
import { Programa } from 'src/logica/compilador/Programa';
import { Eq, Eqf, Ge, Gef, Gt, Gtf, Le, Lef, Lt, Ltf, Ne, Nef } from "src/logica/instrucciones/Comparaciones";
import { Halt } from 'src/logica/instrucciones/Otras';
import { DataSegment } from 'src/logica/segmentoDatos/SegmentoDatos';
import { CadenaInb } from 'src/logica/util/CadenaInb';
import { FloatDataType, IntegerDataType } from 'src/logica/util/DataTypes';
import { Logger } from 'src/logica/util/Logger';

describe('Un programa en ejecución con dos número enteros en la pila,', () => {
    let programa: Programa;
    let halt: Halt;

    beforeEach(() => {
        Logger.getInstance().clean();
        Consola.getInstance().clean();
        CadenaInb.getInstance().clean();
        DataSegment.getInstance().clean();
        programa = new Programa();
        halt = new Halt(1, programa);
        programa.pila.push(new IntegerDataType(7), 2); // entero1
        programa.pila.push(new IntegerDataType(6), 2); // entero2
    });

    it('al ejecutar la instrucción GT, realiza la comparación entero1 > entero2', () => {
        const instruccion = new Gt(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(1); // 7 > 6
    });

    it('al ejecutar la instrucción LT, realiza la comparación entero1 < entero2', () => {
        const instruccion = new Lt(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(0); // 7 < 6
    });

    it('al ejecutar la instrucción GE, realiza la comparación entero1 >= entero2', () => {
        const instruccion1 = new Ge(0);
        const instruccion2 = new Ge(1);
        halt = new Halt(2, programa);
        programa.codigo.push(instruccion1);
        programa.codigo.push(instruccion2);
        programa.codigo.push(halt);

        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(1); // 7 >= 6

        programa.pila.push(new IntegerDataType(1), 2); // PUSH 1
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(1); // 1 >= 1
    });

    it('al ejecutar la instrucción LE, realiza la comparación entero1 <= entero2', () => {
        const instruccion1 = new Le(0);
        const instruccion2 = new Le(1);
        halt = new Halt(2, programa);
        programa.codigo.push(instruccion1);
        programa.codigo.push(instruccion2);
        programa.codigo.push(halt);

        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(0); // 7 <= 6

        programa.pila.push(new IntegerDataType(0), 2); // PUSH 0
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(1); // 0 <= 0
    });

    it('al ejecutar la instrucción EQ, realiza la comparación entero1 == entero2', () => {
        const instruccion = new Eq(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(0); // 7 == 6
    });

    it('al ejecutar la instrucción NE, realiza la comparación entero1 != entero2', () => {
        const instruccion = new Ne(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(1); // 7 != 6
    });
});

describe('Un programa en ejecución con dos número reales en la pila,', () => {
    let programa: Programa;
    let halt: Halt;

    beforeEach(() => {
        Consola.getInstance().clean();
        Logger.getInstance().clean();
        CadenaInb.getInstance().clean();
        DataSegment.getInstance().clean();
        programa = new Programa();
        halt = new Halt(1, programa);
        programa.pila.push(new FloatDataType(7.5), 4); // real1
        programa.pila.push(new FloatDataType(7.25), 4); // real2
    });

    it('al ejecutar la instrucción GTF, realiza la comparación real1 > real2', () => {
        const instruccion = new Gtf(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(1); // 7.5 > 7.25
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);
    });

    it('al ejecutar la instrucción LTF, realiza la comparación real1 < real2', () => {
        const instruccion = new Ltf(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(0); // 7.5 < 7.25
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);
    });

    it('al ejecutar la instrucción GEF, realiza la comparación real1 >= real2', () => {
        const instruccion1 = new Gef(0);
        const instruccion2 = new Gef(1);
        halt = new Halt(2, programa);
        programa.codigo.push(instruccion1);
        programa.codigo.push(instruccion2);
        programa.codigo.push(halt);

        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(1); // 7.5 >= 7.25
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);

        programa.pila.push(new FloatDataType(1.5), 4); // PUSHF 1.5
        programa.pila.push(new FloatDataType(1.5), 4); // PUSHF 1.5
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(1); // 1.5 >= 1.5
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);
    });

    it('al ejecutar la instrucción LEF, realiza la comparación real1 <= real2', () => {
        const instruccion1 = new Lef(0);
        const instruccion2 = new Lef(1);
        halt = new Halt(2, programa);
        programa.codigo.push(instruccion1);
        programa.codigo.push(instruccion2);
        programa.codigo.push(halt);

        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(0); // 7.5 <= 7.25
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);

        programa.pila.push(new FloatDataType(1.5), 4); // PUSHF 1.5
        programa.pila.push(new FloatDataType(1.5), 4); // PUSHF 1.5
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(1); // 1.5 <= 1.5
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);
    });

    it('al ejecutar la instrucción EQF, realiza la comparación real1 == real2', () => {
        const instruccion1 = new Eqf(0);
        const instruccion2 = new Eqf(1);
        halt = new Halt(2, programa);
        programa.codigo.push(instruccion1);
        programa.codigo.push(instruccion2);
        programa.codigo.push(halt);
        programa.pila.push(new FloatDataType(7.25), 4); // PUSHF 7.25

        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(1); // 7.25 == 7.25
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);

        programa.pila.push(new FloatDataType(1.5), 4); // PUSHF 1.5
        programa.pila.push(new FloatDataType(1.55), 4); // PUSHF 1.5
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(0); // 1.5 == 1.55
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);
    });

    it('al ejecutar la instrucción NEF, realiza la comparación real1 != real2', () => {
        const instruccion1 = new Nef(0);
        const instruccion2 = new Nef(1);
        halt = new Halt(2, programa);
        programa.codigo.push(instruccion1);
        programa.codigo.push(instruccion2);
        programa.codigo.push(halt);

        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(1); // 7.5 != 7.25
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);

        programa.pila.push(new FloatDataType(1.54321), 4); // PUSHF 1.54321
        programa.pila.push(new FloatDataType(1.54321), 4); // PUSHF 1.54321       
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(0); // 1.54321 != 1.54321
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);
    });
});