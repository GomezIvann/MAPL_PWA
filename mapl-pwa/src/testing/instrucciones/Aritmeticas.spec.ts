import { Linea } from 'src/logica/compilador/Linea';
import { Programa } from 'src/logica/compilador/Programa';
import { Add, Addf, Div, Divf, Mod, Mul, Mulf, Sub, Subf } from 'src/logica/instrucciones/Aritmeticas';
import { Halt } from 'src/logica/instrucciones/Otras';
import { FloatDataType, IntegerDataType } from 'src/logica/util/DataTypes';
import { Logger } from 'src/logica/util/Logger';

describe('Un programa en ejecución con dos número enteros en la pila,', () => {
    let programa: Programa;
    let halt: Halt;

    beforeEach(() => {
        programa = new Programa();
        halt = new Halt(1, programa);
        programa.pila.push(new IntegerDataType(20), 2); // PUSH 10
        programa.pila.push(new IntegerDataType(10), 2); // PUSH 20
        Logger.getInstance().clean();
    });

    it('al ejecutar la instrucción ADD, coloca en la cima de esta la suma de ambos', () => {
        const instruccion = new Add(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion(); // 20+10
        expect(programa.pila.top().value).toEqual(30);
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);
    });

    it('al ejecutar la instrucción SUB, coloca en la cima de esta la resta de ambos', () => {
        const instruccion = new Sub(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion(); // 20-10
        expect(programa.pila.top().value).toEqual(10);
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);
    });

    it('al ejecutar la instrucción MUL, coloca en la cima de esta la multiplicación de ambos', () => {
        const instruccion = new Mul(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion(); // 20*10
        expect(programa.pila.top().value).toEqual(200);
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);
    });

    it('al ejecutar la instrucción DIV, coloca en la cima de esta la división de ambos', () => {
        const instruccion = new Div(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion(); // 20/10
        expect(programa.pila.top().value).toEqual(2);
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);
    });

    it('al ejecutar la instrucción DIV, si la división es por 0, registra una incidencia', () => {
        const instruccion = new Div(0);
        programa.texto.push(new Linea("div", 0));
        programa.codigo.push(instruccion);
        programa.codigo.push(halt); 
        programa.pila.push(new IntegerDataType(0), 2);

        programa.ejecutarSiguienteInstruccion(); // 10/0
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("División por 0.");
    });

    it('al ejecutar la instrucción MOD, coloca en la cima de esta el resto de la división de ambos', () => {
        const instruccion = new Mod(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion(); // 20%10
        expect(programa.pila.top().value).toEqual(0);
        expect(programa.pila.top()).toBeInstanceOf(IntegerDataType);
    });
});

describe('Un programa en ejecución con dos número reales en la pila,', () => {
    let programa: Programa;
    let halt: Halt;

    beforeEach(() => {
        programa = new Programa();
        halt = new Halt(1, programa);
        programa.pila.push(new FloatDataType(30.75), 4);
        programa.pila.push(new FloatDataType(10.25), 4);
        Logger.getInstance().clean();
    });

    it('al ejecutar la instrucción ADDF, coloca en la cima de esta la suma de ambos', () => {
        const instruccion = new Addf(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(41);
        expect(programa.pila.top()).toBeInstanceOf(FloatDataType);
    });

    it('al ejecutar la instrucción SUBF, coloca en la cima de esta la resta de ambos', () => {
        const instruccion = new Subf(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(20.5);
        expect(programa.pila.top()).toBeInstanceOf(FloatDataType);
    });

    it('al ejecutar la instrucción MULF, coloca en la cima de esta la multiplicación de ambos', () => {
        const instruccion = new Mulf(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(315.1875);
        expect(programa.pila.top()).toBeInstanceOf(FloatDataType);
    });

    it('al ejecutar la instrucción DIVF, coloca en la cima de esta la división de ambos', () => {
        const instruccion = new Divf(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(3);
        expect(programa.pila.top()).toBeInstanceOf(FloatDataType);
    });

    it('al ejecutar la instrucción DIVF, si la división es por 0, registra una incidencia', () => {
        const instruccion = new Divf(0);
        programa.texto.push(new Linea("divf", 0));
        programa.codigo.push(instruccion);
        programa.codigo.push(halt); 
        programa.pila.push(new FloatDataType(0), 4);

        programa.ejecutarSiguienteInstruccion(); // 10.25/0
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("División por 0.");
    });
});