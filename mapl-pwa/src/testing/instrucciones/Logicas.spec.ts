import { Programa } from 'src/logica/compilador/Programa';
import { And, Not, Or } from "src/logica/instrucciones/Logicas";
import { Halt } from 'src/logica/instrucciones/Otras';
import { IntegerDataType } from 'src/logica/util/DataTypes';

describe('Un programa en ejecución con dos número enteros en la pila', () => {
    let programa: Programa;
    let halt: Halt;

    beforeEach(() => {
        programa = new Programa();
        halt = new Halt(1, programa);
        programa.pila.push(new IntegerDataType(0), 2);
        programa.pila.push(new IntegerDataType(2), 2);
    });

    it('al ejecutar la instrucción AND deja en la cima de esta 1 si ambos son ciertos', () => {
        const instruccion = new And(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(0);
    });

    it('al ejecutar la instrucción OR deja en la cima de esta 1 si alguno es cierto', () => {
        const instruccion = new Or(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(1);
    });

    it('al ejecutar la instrucción NOT deja en la cima de esta el contrario (si es cierto deja falso y viceversa)', () => {
        const instruccion = new Not(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(0);
    });
});