import { Consola } from "src/logica/depurador/Consola";
import { Label } from 'src/logica/depurador/Label';
import { Programa } from "src/logica/depurador/Programa";
import { Sub } from 'src/logica/instrucciones/Aritmeticas';
import { Dup, Push, Store } from 'src/logica/instrucciones/ManipulacionPila';
import { Halt } from "src/logica/instrucciones/Otras";
import { Jmp, Jnz, Jz } from 'src/logica/instrucciones/Salto';
import { DataSegment } from "src/logica/segmentoDatos/SegmentoDatos";
import { CadenaInb } from "src/logica/util/CadenaInb";
import { AddressDataType, IntegerDataType, VariableDataType } from 'src/logica/util/DataTypes';
import { Logger } from "src/logica/util/Logger";

describe('Un programa en ejecución,', () => {
    let programa: Programa;

    beforeEach(() => {
        Logger.getInstance().clean();
        Consola.getInstance().clean();
        CadenaInb.getInstance().clean();
        DataSegment.getInstance().clean();

        programa = new Programa();
        const labelInicio = new Label("inicio:", 1);
        const labelFin = new Label("fin:", 6);
        const jmp = new Jmp(5, "inicio", programa);
        const jz = new Jz(2, "fin", programa);
        const jnz = new Jnz(6, "inicio", programa);
        jmp.label = labelInicio;
        jz.label = labelFin;
        jnz.label = labelInicio;

        programa.codigo.push(new Push(0, "1"));
        programa.codigo.push(new Dup(1));
        programa.codigo.push(jz);
        programa.codigo.push(new Push(3, "1"));
        programa.codigo.push(new Sub(4));
        programa.codigo.push(jmp);
        programa.codigo.push(jnz);
        programa.codigo.push(new Halt(7, programa));
    });

    it('al ejecutar retroceder hasta, recupera el estado de la ejecución (en este caso la pila) justo antes de la instrucción pasada como parámetro', () => {
        programa.ejecutarHasta(5);
        expect(programa.ip).toEqual(5);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.ip).toEqual(1);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(0);
        programa.retrocederHasta(4);
        expect(programa.pila.top().value).toEqual(1);
        expect(programa.ip).toEqual(4);
    });
});

describe('Un programa en ejecución,', () => {
    let programa: Programa;
    let halt: Halt;

    beforeEach(() => {
        Logger.getInstance().clean();
        Consola.getInstance().clean();
        CadenaInb.getInstance().clean();
        DataSegment.getInstance().clean();
        programa = new Programa();
        halt = new Halt(1, programa);
    });

    it('al ejecutar retroceder una instrucción, recupera el estado de la ejecución (en este caso la memoria) justo antes de la instrucción pasada como parámetro', () => {
        const instruccion = new Store(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.pila.push(new AddressDataType(0), 2); // Dir 0
        programa.pila.push(new IntegerDataType(64), 2);

        programa.ejecutarSiguienteInstruccion();
        let dt = DataSegment.getInstance().get(0)[0];
        expect(dt).toBeInstanceOf(VariableDataType);
        let variable: VariableDataType = dt as VariableDataType;
        expect(variable.value.value).toEqual(64);
        programa.retrocederUnaInstruccion();
        expect(DataSegment.getInstance().get(0)).toEqual(undefined);
        expect(programa.ip).toEqual(0);
    });
});

describe('Un programa en ejecución,', () => {
    let programa: Programa;

    beforeEach(() => {
        Logger.getInstance().clean();
        Consola.getInstance().clean();
        CadenaInb.getInstance().clean();
        DataSegment.getInstance().clean();

        programa = new Programa();
        const labelInicio = new Label("inicio:", 1);
        const labelFin = new Label("fin:", 6);
        const jmp = new Jmp(5, "inicio", programa);
        const jz = new Jz(2, "fin", programa);
        const jnz = new Jnz(6, "inicio", programa);
        jmp.label = labelInicio;
        jz.label = labelFin;
        jnz.label = labelInicio;

        programa.codigo.push(new Push(0, "1"));
        programa.codigo.push(new Dup(1));
        programa.codigo.push(jz);
        programa.codigo.push(new Push(3, "1"));
        programa.codigo.push(new Sub(4));
        programa.codigo.push(jmp);
        programa.codigo.push(jnz);
        programa.codigo.push(new Halt(7, programa));
    });

    it('al ejecutar reiniciar, devuelve el programa a su estado inicial, para que pueda volver a ser ejecutado', () => {
        programa.ejecuccionCompleta();
        expect(programa.finalizado).toBeTruthy();
        expect(programa.ip).toEqual(7);
        programa.reiniciar();
        expect(programa.ip).toEqual(0);
        programa.ejecuccionCompleta();
        expect(programa.finalizado).toBeTruthy();
        expect(programa.ip).toEqual(7);
    });
});