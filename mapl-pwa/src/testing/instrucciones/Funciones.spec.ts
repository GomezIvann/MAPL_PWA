import { Consola } from "src/logica/depurador/Consola";
import { Funcion } from 'src/logica/depurador/Funcion';
import { Label } from 'src/logica/depurador/Label';
import { Linea } from 'src/logica/depurador/Linea';
import { Programa } from "src/logica/depurador/Programa";
import { Out, Outb } from 'src/logica/instrucciones/EntradaSalida';
import { Call, Enter, Ret } from 'src/logica/instrucciones/Funciones';
import { Pushb, Push, Pushf } from 'src/logica/instrucciones/ManipulacionPila';
import { Halt } from "src/logica/instrucciones/Otras";
import { DataSegment } from "src/logica/segmentoDatos/SegmentoDatos";
import { CadenaInb } from "src/logica/util/CadenaInb";
import { Logger } from "src/logica/util/Logger";

describe('Un programa en ejecución,', () => {
    let programa: Programa;

    beforeEach(() => {
        Logger.getInstance().clean();
        Consola.getInstance().clean();
        CadenaInb.getInstance().clean();
        DataSegment.getInstance().clean();
        
        programa = new Programa();
        const labelMain = new Label("main:", 2);
        const call = new Call(0, "main", programa);
        call.label = labelMain;
        call.funcion = new Funcion("main:");

        programa.codigo.push(call);
        programa.codigo.push(new Halt(1, programa));
        programa.codigo.push(new Pushb(2, "42"));
        programa.codigo.push(new Outb(3));
        programa.codigo.push(new Push(4, "1492"));
        programa.codigo.push(new Out(5));
        programa.codigo.push(new Pushb(6, "42"));
        programa.codigo.push(new Outb(7));
        programa.codigo.push(new Ret(8, programa, [""]));
    });

    it('al ejecutar la instrucción CALL, salta al comienzo de la función, y al ejecutar RET finaliza dicha función', () => {
        programa.ejecutarSiguienteInstruccion();
        expect(programa.ip).toEqual(2);
        expect(programa.pila.top().value).toEqual(1024);
        programa.ejecutarHasta(8);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.ip).toEqual(1);
        expect(Consola.getInstance().salidasAsString()).toEqual("*1492*");
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
        const labelMain = new Label("main:", 4);
        const call = new Call(2, "main", programa);
        call.label = labelMain;
        call.funcion = new Funcion("main:");

        programa.codigo.push(new Push(0, "43"));
        programa.codigo.push(new Pushf(1, "1.5")); 
        programa.codigo.push(call);
        programa.codigo.push(new Halt(3, programa));
        programa.codigo.push(new Ret(4, programa, ["0","0","6"]));
    });

    it('al ejecutar la instrucción CALL, con parámetros, al finalizar la función, RET debe limpiarlos', () => {
        programa.ejecutarHasta(3);
        expect(programa.pila.isEmpty()).toBeTruthy();
    });

    it('al ejecutar la instrucción CALL, si el número de parámetros es incorrecto (cte3), registra una incidencia', () => {
        programa.codigo[4] = new Ret(4, programa, ["0","0","5"]);
        const call = new Call(2, "main", programa);
        call.label = new Label("main:", 4);
        const funcion = new Funcion("main:");
        funcion.sizeParams = 5;
        call.funcion = funcion;
        programa.codigo[2] = call;
        programa.texto.push(new Linea("push 43", 0));
        programa.texto.push(new Linea("pushf 1.5", 1));
        programa.texto.push(new Linea("call", 2));
        programa.texto.push(new Linea("halt", 3));
        programa.texto.push(new Linea("ret", 4));

        programa.ejecuccionCompleta();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("Se esperaban en la cima de la pila 5 bytes de parámetros. "
                +"Sin embargo, ese valor no retira de la pila valores completos.");
    });

    it('cuya instruccion RET no recibe numeros enteros, registra una incidencia', () => {
        expect(function() {
            new Ret(0, programa, ["1.5","0","0"]);
        }).toThrow(new Error("Los parámetros de la instrucción RET tienen que ser enteros."));
    });

    it('cuya instruccion RET no recibe numeros enteros, registra una incidencia', () => {
        expect(function() {
            new Ret(0, programa, ["1","abc","6"]);
        }).toThrow(new Error("Los parámetros de la instrucción RET tienen que ser enteros."));
    });

    it('cuya instruccion RET recibe más parámetros de los esperados, registra una incidencia', () => {
        expect(function() {
            new Ret(0, programa, ["0","0","0","0"]);
        }).toThrow(new Error("Los parámetros de la instrucción RET no son correctos."));
    });

    it('cuya instruccion RET recibe como valor de cte1 un numero que no sea 0, 1, 2 o 4, registra una incidencia', () => {
        expect(function() {
            new Ret(0, programa, ["3","0","0"]);
        }).toThrow(new Error("El tamaño del valor de retorno (primera constante de RET) debe ser 0, 1, 2 o 4."));
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
        const labelMain = new Label("main:", 2);
        const call = new Call(0, "main", programa);
        call.label = labelMain;
        call.funcion = new Funcion("main:");

        programa.codigo.push(call);
        programa.codigo.push(new Halt(1, programa));
        programa.codigo.push(new Enter(2, "6"));
        programa.codigo.push(new Ret(3, programa, ["0", "6", "0"]));
    });

    it('al ejecutar la instrucción ENTER en una función, reserva espacio en la pila para variables locales', () => {
        programa.ejecuccionCompleta();
        expect(programa.pila.isEmpty()).toBeTruthy();
        programa.reiniciar();
        programa.ejecutarHasta(2);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.allocates[0]).toEqual([1014, 1019]);
    });

});