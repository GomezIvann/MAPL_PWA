import { Linea } from 'src/logica/compilador/Linea';
import { Programa } from 'src/logica/compilador/Programa';
import { Halt } from "src/logica/instrucciones/Otras";
import { IntegerDataType } from 'src/logica/util/DataTypes';
import { Logger } from 'src/logica/util/Logger';

describe('Un programa,', () => {
    let programa: Programa;
    let halt: Halt;

    beforeEach(() => {
        programa = new Programa();
        halt = new Halt(0, programa);
        programa.codigo.push(halt);
        programa.texto.push(new Linea("halt", 0));
        Logger.getInstance().clean();
    });

    it('al ejecutar la instrucción HALT, finaliza su ejecución', () => {
        programa.ejecutarSiguienteInstruccion();
        expect(programa.finalizado).toBeTruthy();
        expect(programa.ip).toEqual(0);
    });

    it('al ejecutar la instrucción HALT y haber valores en la pila, registra una incidencia', () => {
        programa.pila.push(new IntegerDataType(0), 2);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.finalizado).toBeFalsy();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("El programa finaliza dejando valores en la pila.");
    });
});