import { Consola } from 'src/logica/compilador/Consola';
import { Linea } from 'src/logica/compilador/Linea';
import { Programa } from "src/logica/compilador/Programa";
import { Dup, Dupb, Dupf, Load, Loadb, Loadf, Pop, Popb, Popf, Push, Pusha, Pushb, Pushf, Store, Storeb, Storef } from "src/logica/instrucciones/ManipulacionPila";
import { Halt } from "src/logica/instrucciones/Otras";
import { DataSegment } from 'src/logica/segmentoDatos/SegmentoDatos';
import { CadenaInb } from 'src/logica/util/CadenaInb';
import { AddressDataType, ByteDataType, FloatDataType, IntegerDataType, VariableDataType } from 'src/logica/util/DataTypes';
import { Logger } from 'src/logica/util/Logger';

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

    it('al ejecutar la instrucción PUSH 20, deja en la cima de esta el número entero 20', () => {
        const instruccion = new Push(0, "20");
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(20);
    });

    it('al ejecutar la instrucción PUSHF 20.5, deja en la cima de esta el número real 20', () => {
        const instruccion = new Pushf(0, "20.5");
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(20.5);
    });

    it('al ejecutar la instrucción PUSHB 10, deja en la cima de esta el caracter salto de línea', () => {
        const instruccion = new Pushb(0, "10");
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().toString()).toEqual(JSON.stringify("\n"));
    });

    it('al ejecutar la instrucción PUSHA BP y PUSHA 1000, dejan en la cima de esta el valor del puntero BP y la dirección 1000, respectivamente', () => {
        const instruccion1 = new Pusha(0, "BP");
        const instruccion2 = new Pusha(1, "1000");
        programa.codigo.push(instruccion1);
        programa.codigo.push(instruccion2);
        programa.codigo.push(halt);

        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(1024);
        expect(programa.pila.top()).toBeInstanceOf(AddressDataType);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(1000);
        expect(programa.pila.top()).toBeInstanceOf(AddressDataType);
    });
    
    it('al ejecutar la instrucción PUSH con un parametro erróneo (no entero), lanza un error.', () => {
        expect(function() {
            new Push(0, "abc");
        }).toThrow(new Error("Se esperaba un número entero. En su lugar, se encontró 'abc'."));

        expect(function() {
            new Push(0, "20.5");
        }).toThrow(new Error("Se esperaba un número entero. En su lugar, se encontró '20.5'."));

        expect(function() {
            new Push(0, undefined);
        }).toThrow(new Error("Se esperaba un número entero. Sin embargo, no se encontró ningún valor."));
    });


    it('al ejecutar la instrucción PUSHF con un parametro erróneo (no real), lanza un error.', () => {
        expect(function() {
            new Pushf(0, "abc");
        }).toThrow(new Error("Se esperaba un número real. En su lugar, se encontró 'abc'."));
        
        expect(function() {
            new Pushf(0, undefined);
        }).toThrow(new Error("Se esperaba un número real. Sin embargo, no se encontró ningún valor."));
    });
 
    it('al ejecutar la instrucción PUSHB con un parametro erróneo (no entero), lanza un error.', () => {
        expect(function() {
            new Pushb(0, "abc");
        }).toThrow(new Error("Se esperaba un número entero. En su lugar, se encontró 'abc'."));

        expect(function() {
            new Pushb(0, "20.5");
        }).toThrow(new Error("Se esperaba un número entero. En su lugar, se encontró '20.5'."));
        
        expect(function() {
            new Pushb(0, undefined);
        }).toThrow(new Error("Se esperaba un número entero. Sin embargo, no se encontró ningún valor."));
    });

    it('al ejecutar la instrucción PUSHA con un parametro erróneo (no entero), lanza un error.', () => {
        expect(function() {
            new Pusha(0, "abc");
        }).toThrow(new Error("Se esperaba una dirección de memoria (entero o BP). En su lugar, se encontró 'abc'."));

        expect(function() {
            new Pusha(0, "20.5");
        }).toThrow(new Error("Se esperaba una dirección de memoria (entero o BP). En su lugar, se encontró '20.5'."));
        
        expect(function() {
            new Pusha(0, undefined);
        }).toThrow(new Error("Se esperaba una dirección de memoria (entero o BP). Sin embargo, no se encontró ningún valor."));

        expect(function() {
            new Pusha(0, "-10");
        }).toThrow(new Error("Se esperaba una dirección de memoria positiva. En su lugar, se encontró '-10'."));
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

    it('al ejecutar la instrucción POP, saca un entero de la cima de la pila.', () => {
        const instruccion = new Pop(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.pila.push(new IntegerDataType(10), 2);
        programa.pila.push(new IntegerDataType(20), 2);
        
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(10);
    });

    it('al ejecutar la instrucción POPF, saca un real de la cima de la pila.', () => {
        const instruccion = new Popf(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.pila.push(new FloatDataType(10.225), 4);
        programa.pila.push(new FloatDataType(20.5), 4);
        
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(10.225);
    });

    it('al ejecutar la instrucción POPB, saca un byte de la cima de la pila.', () => {
        const instruccion = new Popb(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.pila.push(new ByteDataType(9), 1);
        programa.pila.push(new ByteDataType(10), 1);
        
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().toString()).toEqual(JSON.stringify("\t"));
    });

    it('al ejecutar la instrucción POP, estando la pila vacía, registra una incidencia.', () => {
        const instruccion = new Pop(0);
        programa.texto.push(new Linea("pop", 0));
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        
        programa.ejecutarSiguienteInstruccion();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("No había suficientes bytes en la pila para ejecutar la instrucción.");
    });

    it('al ejecutar la instrucción POP, si la instrucción pide más bytes de los que hay en la cima de la pila, registra una incidencia.', () => {
        const instruccion = new Pop(0);
        programa.texto.push(new Linea("pop", 0));
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.pila.push(new FloatDataType(10.225), 4);
        programa.pila.push(new ByteDataType(9), 1);
        
        programa.ejecutarSiguienteInstruccion();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("Los bytes retirados para la instrucción no corresponden a un único valor.");
    });

    it('al ejecutar la instrucción POP, si la instrucción pide más bytes de los que hay en la cima de la pila, registra una incidencia.', () => {
        const instruccion = new Pop(0);
        programa.texto.push(new Linea("pop", 0));
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.pila.push(new FloatDataType(10.225), 4);
        
        programa.ejecutarSiguienteInstruccion();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("Los bytes retirados para la instrucción dejan en la pila "
            + "los últimos bytes del valor sin retirar.");
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

    it('al ejecutar la instrucción DUP, duplica el entero en la cima de la pila, volviendo a insertar este.', () => {
        const instruccion = new Dup(0);
        const pop = new Pop(1);
        halt = new Halt(2, programa);
        programa.codigo.push(instruccion);
        programa.codigo.push(pop);
        programa.codigo.push(halt);
        const pdt = new IntegerDataType(10);
        programa.pila.push(pdt, 2);
    
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(10);
        expect(programa.pila.top()).not.toBe(pdt); // Nos aseguramos de que hace una copia y no lo inserta por referencia.
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(10);
        expect(programa.pila.top()).toBe(pdt);
    });

    it('al ejecutar la instrucción DUPF, duplica el real en la cima de la pila, volviendo a insertar este.', () => {
        const instruccion = new Dupf(0);
        const pop = new Popf(1);
        halt = new Halt(2, programa);
        programa.codigo.push(instruccion);
        programa.codigo.push(pop);
        programa.codigo.push(halt);
        const pdt = new FloatDataType(20.5);
        programa.pila.push(pdt, 4);
    
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(20.5);
        expect(programa.pila.top()).not.toBe(pdt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(20.5);
        expect(programa.pila.top()).toBe(pdt);
    });

    it('al ejecutar la instrucción DUPB, duplica el char en la cima de la pila, volviendo a insertar este.', () => {
        const instruccion = new Dupb(0);
        const pop = new Popb(1);
        halt = new Halt(2, programa);
        programa.codigo.push(instruccion);
        programa.codigo.push(pop);
        programa.codigo.push(halt);
        const pdt = new ByteDataType(97);
        programa.pila.push(pdt, 1);
    
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().toString()).toEqual(JSON.stringify("a"));
        expect(programa.pila.top()).not.toBe(pdt);
        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().toString()).toEqual(JSON.stringify("a"));
        expect(programa.pila.top()).toBe(pdt);
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

    it('al ejecutar la instrucción LOAD, carga el entero de la memoria, en la pila, que está ubicado en la dirección especificada por la cima de la pila.', () => {
        const instruccion = new Load(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        const entero = new IntegerDataType(10); // Valor de la variable
        const address = new AddressDataType(0); // Dir
        programa.memoria.store(0, new VariableDataType("Var0", entero, 2)); // Variable en memoria
        programa.pila.push(address, 2);

        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(10);
    });

    it('al ejecutar la instrucción LOADF, carga el real de la memoria, en la pila, que está ubicado en la dirección especificada por la cima de la pila.', () => {
        const instruccion = new Loadf(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        const real = new FloatDataType(20.225); // Valor de la variable
        const address = new IntegerDataType(1); // Dir
        programa.memoria.store(1, new VariableDataType("Var1", real, 4)); // Variable en memoria
        programa.pila.push(address, 2);

        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().value).toEqual(20.225);
    });

    it('al ejecutar la instrucción LOADB, carga el char de la memoria, en la pila, que está ubicado en la dirección especificada por la cima de la pila.', () => {
        const instruccion = new Loadb(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        const char = new ByteDataType(100);     // Valor de la variable
        const address = new AddressDataType(2); // Dir
        programa.memoria.store(2, new VariableDataType("Var2", char, 1)); // Variable en memoria
        programa.pila.push(address, 2);

        programa.ejecutarSiguienteInstruccion();
        expect(programa.pila.top().toString()).toEqual(JSON.stringify("d"));
    });

    it('al ejecutar la instrucción LOAD a una dirección sin una variable, se registra una incidencia.', () => {
        const instruccion = new Load(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.texto.push(new Linea("load", 0));
        programa.texto.push(new Linea("halt", 1));
        const address = new AddressDataType(10);
        programa.pila.push(address, 2);

        programa.ejecutarSiguienteInstruccion();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("Se lee una zona de memoria que no ha sido inicializada (dir 10). Se introducirá basura en la pila.");
    });

    it('al ejecutar la instrucción LOAD a una dirección fuera del rango [0-1024], se registra una incidencia.', () => {
        const instruccion = new Load(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.texto.push(new Linea("load", 0));
        programa.texto.push(new Linea("halt", 1));
        const address = new AddressDataType(1070);
        programa.pila.push(address, 2);

        programa.ejecutarSiguienteInstruccion();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("Acceso a una zona de memoria no existente (dir 1070 a 1071).");
    });

    it('al ejecutar la instrucción LOAD a una dirección que no es la de comienzo de la variable, se registra una incidencia.', () => {
        const instruccion = new Load(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.texto.push(new Linea("load", 0));
        programa.texto.push(new Linea("halt", 1));
        const entero = new IntegerDataType(100);
        const address = new AddressDataType(1);
        programa.memoria.store(0, new VariableDataType("Var0", entero, 2));
        programa.pila.push(address, 2);

        programa.ejecutarSiguienteInstruccion();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("Se ha realizado una lectura parcial en memoria libre (dir 1).");
    });

    it('al ejecutar la instrucción LOAD a una dirección que contiene un valor de la pila, se registra una incidencia.', () => {
        const instruccion = new Load(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.texto.push(new Linea("load", 0));
        programa.texto.push(new Linea("halt", 1));
        const entero = new IntegerDataType(100);
        const address = new AddressDataType(1022);
        programa.pila.push(entero, 2);
        programa.pila.push(address, 2);

        programa.ejecutarSiguienteInstruccion();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("Se lee una zona de memoria que no contiene una variable (dir 1022).");
    });

    it('al ejecutar la instrucción LOAD a una dirección que contiene una variable sin inicializar, se registra una incidencia.', () => {
        const instruccion = new Load(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.texto.push(new Linea("load", 0));
        programa.texto.push(new Linea("halt", 1));
        const entero = new IntegerDataType(10);
        const address = new AddressDataType(0);
        programa.memoria.storeGlobalVariable(new VariableDataType("Var0", undefined, 2));
        programa.pila.push(address, 2);

        programa.ejecutarSiguienteInstruccion();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("Se lee la variable 'Var0' la cual no ha sido inicializada. Se introducirá basura en la pila.");
    });

    it('al ejecutar la instrucción LOADF, se piden más bytes de los que hay en esa posición, se registra una incidencia.', () => {
        const instruccion = new Loadf(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.texto.push(new Linea("loadf", 0));
        programa.texto.push(new Linea("halt", 1));
        const entero = new IntegerDataType(10);
        const address = new AddressDataType(0);
        programa.memoria.store(0, new VariableDataType("Var0", entero, 2));
        programa.pila.push(address, 2);

        programa.ejecutarSiguienteInstruccion();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("La lectura transfiere más bytes de los que tiene 'Var0'."
                +" La variable tiene 2 bytes y se han leído 4 por lo que se introduzirá basura en la pila.");
    });

    it('al ejecutar la instrucción LOADF, se piden más bytes de los que hay en esa posición, se registra una incidencia.', () => {
        const instruccion = new Load(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.texto.push(new Linea("load", 0));
        programa.texto.push(new Linea("halt", 1));
        const real = new FloatDataType(10);
        const address = new AddressDataType(0);
        programa.memoria.store(0, new VariableDataType("Var0", real, 4));
        programa.pila.push(address, 2);

        programa.ejecutarSiguienteInstruccion();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("La lectura transfiere menos bytes de los que tiene 'Var0'."
                +" La variable tiene 4 bytes y se han leído 2 por lo que se introduzirá basura en la pila.");
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

    it('al ejecutar la instrucción STORE, guarda en memoria el entero de la cima de la pila', () => {
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
    });

    it('al ejecutar la instrucción STOREF, guarda en memoria el real de la cima de la pila', () => {
        const instruccion = new Storef(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.pila.push(new AddressDataType(0), 2);
        programa.pila.push(new FloatDataType(100.5), 4);

        programa.ejecutarSiguienteInstruccion();
        let dt = DataSegment.getInstance().get(0)[0];
        expect(dt).toBeInstanceOf(VariableDataType);
        let variable: VariableDataType = dt as VariableDataType;
        expect(variable.value.value).toEqual(100.5);
    });

    it('al ejecutar la instrucción STOREB, guarda en memoria el char de la cima de la pila', () => {
        const instruccion = new Storeb(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.pila.push(new AddressDataType(0), 2);
        programa.pila.push(new ByteDataType(110), 1);

        programa.ejecutarSiguienteInstruccion();
        let dt = DataSegment.getInstance().get(0)[0];
        expect(dt).toBeInstanceOf(VariableDataType);
        let variable: VariableDataType = dt as VariableDataType;
        expect(variable.value.value).toEqual(110);
    });

    it('al ejecutar la instrucción STOREB, si accede a una posición fuera del rango [0-1024], registra una incidencia.', () => {
        const instruccion = new Storeb(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.texto.push(new Linea("store", 0));
        programa.texto.push(new Linea("halt", 1));
        programa.pila.push(new AddressDataType(1025), 2);
        programa.pila.push(new ByteDataType(110), 1);

        programa.ejecutarSiguienteInstruccion();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("Acceso a una zona de memoria no existente (dir 1025 a 1025).");
    });

    it('al ejecutar la instrucción STORE, si escribe menos bytes de los que ocupa la variable ya en memoria, registra una incidencia.', () => {
        const instruccion = new Store(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.texto.push(new Linea("store", 0));
        programa.texto.push(new Linea("halt", 1));
        programa.pila.push(new AddressDataType(0), 2);
        programa.pila.push(new IntegerDataType(10), 2);
        programa.memoria.store(0, new VariableDataType("Var0", new FloatDataType(3.5), 4)); // Variable en memoria

        programa.ejecutarSiguienteInstruccion();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("Se escriben menos bytes de los que ocupa 'Var0'. La variable ocupa 4 bytes y se están escribiendo 2.");
    });

    it('al ejecutar la instrucción STOREF, si escribe mas bytes de los que ocupa la variable ya en memoria, registra una incidencia.', () => {
        const instruccion = new Storef(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.texto.push(new Linea("storef", 0));
        programa.texto.push(new Linea("halt", 1));
        programa.pila.push(new AddressDataType(0), 2);
        programa.pila.push(new FloatDataType(1.5), 4);
        programa.memoria.store(0, new VariableDataType("Var0", new IntegerDataType(1), 2)); // Variable en memoria

        programa.ejecutarSiguienteInstruccion();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("Se escriben más bytes de los que ocupa 'Var0'. La variable ocupa 2 bytes y se están escribiendo 4.");
    });

    it('al ejecutar la instrucción STORE, escribe sobre una variable sin cubrir todos sus bytes, registra una incidencia.', () => {
        const instruccion = new Store(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.texto.push(new Linea("store", 0));
        programa.texto.push(new Linea("halt", 1));
        programa.pila.push(new AddressDataType(1), 2);
        programa.pila.push(new IntegerDataType(10), 2);
        programa.memoria.store(0, new VariableDataType("Var0", new FloatDataType(4.5), 4)); // Variable en memoria

        programa.ejecutarSiguienteInstruccion();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("Se ha realizado una escritura parcial en memoria libre (dir 1).");
    });

    it('al ejecutar la instrucción STORE, si escribe sobre un valor de la pila, registra una incidencia.', () => {
        const instruccion = new Store(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.texto.push(new Linea("store", 0));
        programa.texto.push(new Linea("halt", 1));
        programa.pila.push(new IntegerDataType(1), 2);
        programa.pila.push(new AddressDataType(1022), 2);
        programa.pila.push(new IntegerDataType(10), 2);

        programa.ejecutarSiguienteInstruccion();
        expect(Logger.getInstance().incidencias[0].descripcion).toEqual("Posible escritura ilegal sobre valor en la pila (dir 1022 a 1023).");
    });

    it('al ejecutar la instrucción STORE, se puede sobreescribir una variable siempre y cuando ocupen todos sus bytes.', () => {
        const instruccion = new Storef(0);
        programa.codigo.push(instruccion);
        programa.codigo.push(halt);
        programa.texto.push(new Linea("storef", 0));
        programa.texto.push(new Linea("halt", 1));
        programa.pila.push(new AddressDataType(0), 2);
        programa.pila.push(new FloatDataType(350.25), 4);
        programa.memoria.store(0, new VariableDataType("Var0", new FloatDataType(4.5), 4)); // Variable en memoria

        programa.ejecutarSiguienteInstruccion();
        let dt = DataSegment.getInstance().get(0)[0];
        expect(dt).toBeInstanceOf(VariableDataType);
        let variable: VariableDataType = dt as VariableDataType;
        expect(variable.value.value).toEqual(350.25);
    });
});