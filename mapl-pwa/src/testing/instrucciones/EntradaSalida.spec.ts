import { Consola } from 'src/logica/compilador/Consola';
import { Programa } from "src/logica/compilador/Programa";
import { In, Inb, Inf, Out, Outb, Outf } from 'src/logica/instrucciones/EntradaSalida';
import { Halt } from "src/logica/instrucciones/Otras";
import { DataSegment } from 'src/logica/segmentoDatos/SegmentoDatos';
import { CadenaInb } from 'src/logica/util/CadenaInb';
import { IntegerDataType, FloatDataType, ByteDataType } from 'src/logica/util/DataTypes';
import { Logger } from 'src/logica/util/Logger';

describe('Un programa en ejecución,', () => {
    let programa: Programa;
    let halt: Halt;

    beforeEach(() => {
        Consola.getInstance().clean();
        Logger.getInstance().clean();
        CadenaInb.getInstance().clean();
        DataSegment.getInstance().clean();
        programa = new Programa();
        halt = new Halt(1, programa);
    });

    it('al ejecutar la instrucción IN, mete el entero introducido por el usuario en la pila', () => {
        const instruccion = new In(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);

        // Simula la insercion de un valor por parte de un usuario, en este caso un numero entero = 25
        spyOn(window, 'prompt').and.returnValue("25"); // Mock
        programa.ejecutarSiguienteInstruccion();

        expect(window.prompt).toHaveBeenCalledWith("[in] Escriba un número entero:");
        expect(programa.pila.top().value).toEqual(25);
        expect(Consola.getInstance().outputs[0]).toEqual(">Escriba un entero: 25\n");
    });

    it('al ejecutar la instrucción INF, mete el real introducido por el usuario en la pila', () => {
        const instruccion = new Inf(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);

        spyOn(window, 'prompt').and.returnValue("25.75");
        programa.ejecutarSiguienteInstruccion();

        expect(window.prompt).toHaveBeenCalledWith("[in] Escriba un número real:");
        expect(programa.pila.top().value).toEqual(25.75);
        expect(Consola.getInstance().outputs[0]).toEqual(">Escriba un real: 25.75\n");
    });

    it('al ejecutar la instrucción INB, mete un char de la cadena introducida por el usuario en la pila', () => {
        const instruccion1 = new Inb(0);
        const instruccion2 = new Inb(1);
        halt = new Halt(2, programa);
        programa.codigo.push(instruccion1);
        programa.codigo.push(instruccion2);
        programa.codigo.push(halt);

        spyOn(window, 'prompt').and.returnValue("abc");
        programa.ejecutarSiguienteInstruccion();

        expect(window.prompt).toHaveBeenCalledWith("[in] Escriba una cadena de caracteres (cada inb posterior insertará uno de ellos):");
        expect(programa.pila.top().value).toEqual(97);
        expect(CadenaInb.getInstance().value[2]).toEqual("b");
        expect(Consola.getInstance().outputs[0]).toEqual(">Escriba una cadena: abc\n");

        // Si se vuelve a llamar a INB comprobamos que sigue con la cadena anterior (si su longitud es > 1)
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(98);
        expect(CadenaInb.getInstance().value[1]).toEqual("c");
        expect(CadenaInb.getInstance().value[0]).toEqual("\n");
    });
});

describe('Un programa en ejecución,', () => {
    let programa: Programa;
    let halt: Halt;

    beforeEach(() => {
        programa = new Programa();
        halt = new Halt(1, programa);
        Consola.getInstance().clean();
    });

    it('al ejecutar la instrucción OUT, imprime por consola el entero en la cima de la pila', () => {
        const instruccion = new Out(0);
        const value = new IntegerDataType(25);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.pila.push(value, 2);

        programa.ejecutarSiguienteInstruccion();
        expect(Consola.getInstance().outputs[0]).toEqual(value.toString());
    });

    it('al ejecutar la instrucción OUTF, imprime por consola el real en la cima de la pila', () => {
        const instruccion = new Outf(0);
        const value = new FloatDataType(525.63); 
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.pila.push(value, 4);

        programa.ejecutarSiguienteInstruccion();
        expect(Consola.getInstance().outputs[0]).toEqual(value.toString());
    });

    it('al ejecutar la instrucción OUTB, imprime por consola el char en la cima de la pila', () => {
        const instruccion = new Outb(0);
        const value = new ByteDataType(99); // "c"
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.pila.push(value, 1);
        programa.ejecutarSiguienteInstruccion();

        programa.ejecutarSiguienteInstruccion();
        expect(JSON.stringify(Consola.getInstance().outputs[0])).toEqual(value.toString());
    });
});