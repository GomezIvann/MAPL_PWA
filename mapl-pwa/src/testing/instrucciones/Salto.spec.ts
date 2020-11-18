import { Consola } from "src/logica/compilador/Consola";
import { Label } from 'src/logica/compilador/Label';
import { Linea } from "src/logica/compilador/Linea";
import { Programa } from "src/logica/compilador/Programa";
import { Sub } from 'src/logica/instrucciones/Aritmeticas';
import { Dup, Push } from 'src/logica/instrucciones/ManipulacionPila';
import { Halt } from "src/logica/instrucciones/Otras";
import { Jmp, Jnz, Jz } from 'src/logica/instrucciones/Salto';
import { DataSegment } from "src/logica/segmentoDatos/SegmentoDatos";
import { CadenaInb } from "src/logica/util/CadenaInb";
import { IntegerDataType } from "src/logica/util/DataTypes";
import { Logger } from "src/logica/util/Logger";

describe('Un programa,', () => {
    let programa: Programa;
    let halt: Halt;

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

    it('al ejecutar la instrucción JMP, salta a la etiqueta con ese mismo nombre', () => {
        programa.ejecutarHasta(5);
        expect(programa.ip).toEqual(5);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.ip).toEqual(1);
    });

    it('al ejecutar la instrucción JZ, salta a la etiqueta con ese mismo nombre si el valor en la cima de la pila es 0', () => {
        programa.ejecutarHasta(2);
        programa.ejecutarHasta(2);
        expect(programa.ip).toEqual(2);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.ip).toEqual(6);
    });

    it('al ejecutar la instrucción JNZ, salta a la etiqueta con ese mismo nombre si el valor en la cima de la pila es distinto de 0', () => {
        programa.ejecutarHasta(6);
        expect(programa.ip).toEqual(6);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.ip).toEqual(7);
    });
});