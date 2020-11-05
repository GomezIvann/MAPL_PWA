import { Add, Sub, Mul, Div, Addf, Subf, Mod, Divf, Mulf } from '../instrucciones/Aritmeticas';
import { Eq, Eqf, Ge, Gef, Gt, Gtf, Le, Lef, Lt, Ltf, Ne, Nef } from '../instrucciones/Comparaciones';
import { B2i, F2i, I2b, I2f } from '../instrucciones/Conversiones';
import { In, Inb, Inf, Out, Outb, Outf } from '../instrucciones/EntradaSalida';
import { And, Not, Or } from '../instrucciones/Logicas';
import { Dup, Pop, Push, Pushf, Pushb, Popb, Popf, Dupb, Dupf, Load, Loadb, Loadf, Store, Storef, Storeb, Pusha } from '../instrucciones/ManipulacionPila';
import { Halt, Nop } from '../instrucciones/Otras';
import { Jmp, Jnz, Jz } from '../instrucciones/Salto';
import { Consola } from '../compilador/Consola';
import { Label } from '../compilador/Label';
import { Lenguaje, Tipos } from '../compilador/Lenguaje';
import { Programa } from '../compilador/Programa';
import { Linea } from '../compilador/Linea';
import { Call, Ret } from '../instrucciones/Funciones';
import { Instruccion } from '../instrucciones/Instruccion';
import { PrimitiveSizes, VariableDataType } from './DataTypes';

/**
 * Clase encargada de la lectura del fichero y generacion del programa a partir de este.
 */
export class Parser {
    file: File;                             // Fichero de entrada
    programa: Programa;                     // Programa obtenido de la lectura del fichero

    /**
     * Todas estas variables son para deteccion de errores de programa que puedan ayudar al usuario a formarlo correctamente, dando un mensaje de error
     * lo mas personalizado posible.
     *      _finFuncion: True si finaliza la lectura de una funcion CORRECTAMENTE (HALT, y fuera de la funcion 'init').
     *      _finInit: True si finaliza la lectura de la funcion principal 'init' CORRECTAMENTE (HALT y bien formado).
     *      _programaSinFunciones: True si la lectura del programa finaliza sin haber leido una funcion que no sea 'init'. Sirve para
     *                             añadir un HALT a 'init' cuando no hay funciones de por medio.
     */
    private _finFuncion: boolean;
    private _finInit: boolean;
    private _programaSinFunciones: boolean;

    private _contadorInstrucciones: number;  // Contador para el numero de instruccion. Aumenta en una unidad siempre que se lea una.

    constructor(file: File) {
        this.file = file;
        this.programa = new Programa();
        this._finFuncion = true; // Inicialmente no sabemos si abran funciones o no
        this._finInit = false;   // Inicialmente estamos dentro de la funcion 'init'
        this._programaSinFunciones = true;
        this._contadorInstrucciones = 0;
    }

    /**
     * Metodo que lee el programa pasado como parametro en el constructor.
     * 
     * Resolve: Es la funcion que llamaremos si queremos resolver satisfactoriamente la promesa.
     * Reject: Es la funcion que llamaremos si queremos rechazar la promesa.
     */
    read(): Promise<Programa> {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException("Ha habido un problema parseando el archivo de entrada."));
            };

            reader.onload = (e) => {
                let lineas = reader.result.toString().split("\n"); // Fichero divido en lineas
                var primeraPalabra = ""; // Primera palabra de la linea

                /**
                 * El metodo some se comporta igual que forEach, con la diferencia de que en este se
                 * puede parar su ejecucion con simplemente retornar true de acuerdo a la condicion que queramos
                 */
                lineas.forEach((linea, index) => {
                    /**
                     * Elimina los posibles comentarios de la linea para facilitar la labor de parseo 
                     * (se siguen mostrando por pantalla, solo es interno).
                     */
                    var lineaSinComentarios = linea.trim().split("'")[0];
                    /**
                     * trim() elimina los espacios y terminadores de linea de un string (ubicados antes y despues del texto)
                     * La expresion regular reemplaza todo el string por "" salvo la primera palabra que encuentra
                     * ej. "       hello  world       " --trim()--> "hello  world"
                     *     "hello  world" --replace(REG_EXP)--> "hello"
                     */
                    primeraPalabra = lineaSinComentarios.trim().replace(/ .*/, "").toUpperCase();

                    try {
                        /** 
                         * Cuando dos cases se comportan igual, como es el caso de las instrucciones XXX y XXX(I)
                         * los cases se colocan de seguido y ambas ejecutan el mismo codigo:
                         *      case XXX:
                         *      case XXX(I):
                         *          ...                     (exclusivo de Javascript)
                         */
                        switch (primeraPalabra) {
                            case Lenguaje.PUSH:
                            case Lenguaje.PUSHI:
                                // Divide la linea con cualquier caracter de espacio en blanco (igual a [\r\n\t\f\v])
                                var cte = lineaSinComentarios.trim().split(/\s+/)[1];  // segunda palabra de la linea
                                this.addInstruccion(new Push(this._contadorInstrucciones, cte), linea);
                                break;
                            case Lenguaje.PUSHF:
                                var cte = lineaSinComentarios.trim().split(/\s+/)[1];
                                this.addInstruccion(new Pushf(this._contadorInstrucciones, cte), linea);
                                break;
                            case Lenguaje.PUSHB:
                                var cte = lineaSinComentarios.trim().split(/\s+/)[1];
                                this.addInstruccion(new Pushb(this._contadorInstrucciones, cte), linea);
                                break;
                            case Lenguaje.PUSHA:
                                var cte = lineaSinComentarios.trim().split(/\s+/)[1];
                                this.addInstruccion(new Pusha(this._contadorInstrucciones, cte), linea);
                                break;
                            case Lenguaje.POP:
                            case Lenguaje.POPI:
                                this.addInstruccion(new Pop(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.POPF:
                                this.addInstruccion(new Popf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.POPB:
                                this.addInstruccion(new Popb(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.LOAD:
                            case Lenguaje.LOADI:
                                this.addInstruccion(new Load(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.LOADF:
                                this.addInstruccion(new Loadf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.LOADB:
                                this.addInstruccion(new Loadb(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.STORE:
                            case Lenguaje.STOREI:
                                this.addInstruccion(new Store(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.STOREF:
                                this.addInstruccion(new Storef(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.STOREB:
                                this.addInstruccion(new Storeb(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.DUP:
                            case Lenguaje.DUPI:
                                this.addInstruccion(new Dup(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.DUPF:
                                this.addInstruccion(new Dupf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.DUPB:
                                this.addInstruccion(new Dupb(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.ADD:
                            case Lenguaje.ADDI:
                                this.addInstruccion(new Add(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.ADDF:
                                this.addInstruccion(new Addf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.SUB:
                            case Lenguaje.SUBI:
                                this.addInstruccion(new Sub(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.SUBF:
                                this.addInstruccion(new Subf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.DIV:
                            case Lenguaje.DIVI:
                                this.addInstruccion(new Div(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.DIVF:
                                this.addInstruccion(new Divf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.MUL:
                            case Lenguaje.MULI:
                                this.addInstruccion(new Mul(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.MULF:
                                this.addInstruccion(new Mulf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.MOD:
                                this.addInstruccion(new Mod(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.IN:
                            case Lenguaje.INI:
                                this.addInstruccion(new In(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.INF:
                                this.addInstruccion(new Inf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.INB:
                                this.addInstruccion(new Inb(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.OUT:
                            case Lenguaje.OUTI:
                                this.addInstruccion(new Out(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.OUTF:
                                this.addInstruccion(new Outf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.OUTB:
                                this.addInstruccion(new Outb(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.AND:
                                this.addInstruccion(new And(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.OR:
                                this.addInstruccion(new Or(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.NOT:
                                this.addInstruccion(new Not(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.GT:
                            case Lenguaje.GTI:
                                this.addInstruccion(new Gt(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.GTF:
                                this.addInstruccion(new Gtf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.LT:
                            case Lenguaje.LTI:
                                this.addInstruccion(new Lt(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.LTF:
                                this.addInstruccion(new Ltf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.GE:
                            case Lenguaje.GEI:
                                this.addInstruccion(new Ge(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.GEF:
                                this.addInstruccion(new Gef(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.LE:
                            case Lenguaje.LEI:
                                this.addInstruccion(new Le(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.LEF:
                                this.addInstruccion(new Lef(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.EQ:
                            case Lenguaje.EQI:
                                this.addInstruccion(new Eq(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.EQF:
                                this.addInstruccion(new Eqf(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.NE:
                            case Lenguaje.NEI:
                                this.addInstruccion(new Ne(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.NEF:
                                this.addInstruccion(new Nef(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.B2I:
                                this.addInstruccion(new B2i(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.I2B:
                                this.addInstruccion(new I2b(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.I2F:
                                this.addInstruccion(new I2f(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.F2I:
                                this.addInstruccion(new F2i(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.JMP:
                                var label = linea.trim().split(/\s+/)[1] + ":";
                                this.addInstruccion(new Jmp(this._contadorInstrucciones, label, this.programa), linea);
                                break;
                            case Lenguaje.JZ:
                                var label = lineaSinComentarios.trim().split(/\s+/)[1] + ":";
                                this.addInstruccion(new Jz(this._contadorInstrucciones, label, this.programa), linea);
                                break;
                            case Lenguaje.JNZ:
                                var label = lineaSinComentarios.trim().split(/\s+/)[1] + ":";
                                this.addInstruccion(new Jnz(this._contadorInstrucciones, label, this.programa), linea);
                                break;
                            case Lenguaje.CALL:
                                var label = lineaSinComentarios.trim().split(/\s+/)[1] + ":";
                                this.addInstruccion(new Call(this._contadorInstrucciones, label, this.programa), linea);
                                break;
                            case Lenguaje.RET:
                                if (!this._finInit)
                                    throw new Error("La función 'init' no puede contener otra función.");

                                this.addInstruccion(new Ret(this._contadorInstrucciones, this.programa), linea);
                                this._finFuncion = true; // Fin de la funcion actual leida
                                this._programaSinFunciones = false; // Hay mas funciones en el programa a parte de 'init'
                                break;
                            case Lenguaje.NOP:
                                this.addInstruccion(new Nop(this._contadorInstrucciones), linea);
                                break;
                            case Lenguaje.HALT:
                                this.addInstruccion(new Halt(this._contadorInstrucciones, this.programa), linea);
                                this._finInit = true; // Fin de la funcion principal 'init'
                                break;
                            case Lenguaje.WHITE_LINE:
                                // Al hacer trim() cualquier linea vacia (por muchos espacios que la formen) se convierte en ""
                                // asi se conserva la linea vacia y se interpretan todas igual.
                                this.programa.texto.push(new Linea(linea));
                                break;
                            case Lenguaje.VAR:
                            case Lenguaje.DATA:
                            case Lenguaje.GLOBAL:
                                let declaracion = lineaSinComentarios.trim().split(/\s+/)[1];  // ej. a:int
                                if (declaracion.includes(":")){
                                    let nombre = declaracion.split(":")[0].trim();
                                    let tipo = declaracion.split(":")[1].trim().toUpperCase();
                                    if (tipo === "") // hay espacios entre ':' y el tipo de la variable (ej. a:   int).
                                        tipo = lineaSinComentarios.split(":")[1].trim().toUpperCase();

                                    this.addGlobalVariable(tipo, nombre);
                                    this.programa.texto.push(new Linea(linea));
                                }
                                else
                                    throw new Error("La declaración de la variable global está mal formada.");
                                break;
                            case Lenguaje.TYPE:
                            case Lenguaje.STRUCT:
                                break;
                            default:
                                if (this.isComment(linea.trim()))
                                    this.programa.texto.push(new Linea(linea));
                                else {
                                    let label = lineaSinComentarios.trim();
                                    if (this.isValidLabel(label)) { // Es una etiqueta (o de funcion o de salto)
                                        this.programa.labels.push(new Label(label, this._contadorInstrucciones));
                                        this.programa.texto.push(new Linea(linea));

                                        // Si leemos un Label fuera de la funcion principal 'init' es que es una declaracion de una
                                        // funcion. Fin de funcion pasa a ser false, estamos dentro de una funcion
                                        if (this._finInit) {
                                            // NO se puede declarar una funcion dentro de otra.
                                            if (!this._finFuncion)
                                                throw new Error("No se puede declarar una función dentro de otra.\n'" + linea.trim() + "'.");

                                            this._finFuncion = false;
                                        }
                                    }
                                    else
                                        throw new Error("¡Ninguna intrucción o comentario legible para MAPL!\n'" + linea.trim() + "'.");
                                }
                        }
                    }
                    catch (err) {
                        // Añade la linea donde se produjo el error para que el usuario tenga mas informacion sobre este.
                        throw new Error("Línea " + (index + 1) + ". " + err.message);
                    }
                });

                // Si no se ha leido ninguna instruccion...
                if (!this.programa.hasCodigo())
                    throw new Error("El fichero no contiene ninguna instrucción ejecutable.");
                /** 
                 * Si la lectura del programa finaliza sin HALT, lo añade el sistema automaticamente,
                 * siempre y cuando no haya funciones de por medio. En tal caso su ausencia es un error de formacion.
                 */
                if (!this._finInit && this._programaSinFunciones) {
                    this.addInstruccion(new Halt(this._contadorInstrucciones, this.programa), Lenguaje.HALT.toLowerCase());
                    this._finInit = true; // Fin de la funcion principal 'init'
                }
                /**
                 * Si el parser lanza este error quiere decir que o la funcion principal no se cerro (falta un HALT y no se puede 
                 * añadir automaticamente al haber funciones de por medio) o alguna de las funciones
                 * secundarias no se cerro (falta al menos un RET) y por tanto, la ejecución nunca finalizaria.
                 */
                if (!this._finInit || !this._finFuncion)
                    throw new Error("La ejecución del programa nunca finaliza. Esto puede deberse a la falta de un HALT o RET en la función principal 'init' o"
                        + " en otra función, respectivamente.");

                this.programa.labelForInstruction();
                resolve(this.programa);
            };
            reader.readAsText(this.file);
            Consola.getInstance().addNewFileOutput(this.file.name); // Mostramos el nombre del fichero por consola.
        });
    }
    
    private addGlobalVariable(def: string, nombre: string): void {
        if (def.includes("*")) { // Es un array
            let lengthSTR = def.split("*")[0].trim();
            let tipo = def.split("*")[1];

            if (!Number.isInteger(lengthSTR)) {
                let length = parseInt(lengthSTR);

                for (let i = 0; i < length; i++) 
                    this.addPrimitiveGlobalVariable(tipo, nombre+"["+i+"]");
            }
            else
                throw new Error("No es posible determinar el tamaño del Array (este debe ser un entero).")
        }
        else // Es un tipo primitivo
            this.addPrimitiveGlobalVariable(def, nombre);
    }

    private addPrimitiveGlobalVariable(tipo: string, nombre: string): void {
        let variable = new VariableDataType(nombre, undefined, this.getPrimitiveDataType(tipo));
        this.programa.memoria.storeGlobalVariable(variable);
    }

    /**
     * Devuelve un dato primitivo vacio en funcion del tipo leido (int devuelve un IntegerDataType y viceversa).
     * @param tipo string
     */
    private getPrimitiveDataType(tipo: string): number {
        switch (tipo) {
            case Tipos.INTEGER:
                return PrimitiveSizes.INTEGER;
            case Tipos.REAL:
            case Tipos.FLOAT:
                return PrimitiveSizes.FLOAT;
            case Tipos.CHAR:
            case Tipos.BYTE:
                return PrimitiveSizes.BYTE;
            case Tipos.ADDRESS:
                return PrimitiveSizes.ADDRESS;
            default:
                throw Error("No existe en MAPL el tipo de la variable declarada '"+tipo+"'.");
        }
    }

    /**
     * Añade una instruccion al programa y aumenta el contador de instruccion.
     * @param i Instruccion
     * @param linea Linea
     */
    private addInstruccion(i: Instruccion, linea: string) {
        if (this._finInit && this._finFuncion)
            throw new Error("No puede haber una instruccion que no forme parte de una función.\n'" + linea.trim() + "'.");

        this.programa.codigo.push(i);
        this.programa.texto.push(new Linea(linea, this._contadorInstrucciones));
        this._contadorInstrucciones++;
    }

    /**
     * True si la linea es una etiqueta y no existe ninguna con ese nombre ya en el programa.
     * @param linea 
     */
    private isValidLabel(linea: string): boolean {
        let label = this.programa.getLabelByNombre(linea);
        if (label !== undefined)
            throw new Error("Etiqueta repetida: '" + linea + "'.");

        return linea.endsWith(":");
    }

    /**
     * True si la linea es un comentario.
     * @param linea 
     */
    private isComment(linea: string): boolean {
        return /^\'/.test(linea);
    }
}