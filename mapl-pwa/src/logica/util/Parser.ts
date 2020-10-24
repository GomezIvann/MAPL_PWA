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
import { Lenguaje } from '../compilador/Lenguaje';
import { Programa } from '../compilador/Programa';
import { Linea } from '../compilador/Linea';
import { Call, Ret } from '../instrucciones/Funciones';
import { Instruccion } from '../instrucciones/Instruccion';

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
    
    private contadorInstrucciones: number;  // Contador para el numero de instruccion. Aumenta en una unidad siempre que se lea una.

    constructor(file: File) {
        this.file = file;
        this.programa = new Programa();
        this._finFuncion = true; // Inicialmente no sabemos si abran funciones o no
        this._finInit = false;   // Inicialmente estamos dentro de la funcion 'init'
        this._programaSinFunciones = true;
        this.contadorInstrucciones = 0;
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
                lineas.forEach(linea => {
                    /**
                     * Expresion regular reemplaza todo un string por "" salvo la primera palabra que encuentra
                     * trim() elimina los espacios y terminadores de linea de un string (ubicados ante y despues del texto)
                     * ej. "       hello  world       " --trim()--> "hello  world"
                     */
                    primeraPalabra = linea.trim().replace(/ .*/, "").toUpperCase();

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
                            var cte = linea.trim().split(/\s+/)[1];  // segunda palabra de la linea
                            this.addInstruccion(new Push(this.contadorInstrucciones, cte), linea);
                            break;
                        case Lenguaje.PUSHF:
                            var cte = linea.trim().split(/\s+/)[1];
                            this.addInstruccion(new Pushf(this.contadorInstrucciones, cte), linea);
                            break;
                        case Lenguaje.PUSHB:
                            var cte = linea.trim().split(/\s+/)[1];
                            this.addInstruccion(new Pushb(this.contadorInstrucciones, cte), linea);
                            break;
                        case Lenguaje.PUSHA:
                            var cte = linea.trim().split(/\s+/)[1];
                            this.addInstruccion(new Pusha(this.contadorInstrucciones, cte), linea);
                            break;
                        case Lenguaje.POP:
                        case Lenguaje.POPI:
                            this.addInstruccion(new Pop(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.POPF:
                            this.addInstruccion(new Popf(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.POPB:
                            this.addInstruccion(new Popb(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.LOAD:
                        case Lenguaje.LOADI:
                            this.addInstruccion(new Load(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.LOADF:
                            this.addInstruccion(new Loadf(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.LOADB:
                            this.addInstruccion(new Loadb(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.STORE:
                        case Lenguaje.STOREI:
                            this.addInstruccion(new Store(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.STOREF:
                            this.addInstruccion(new Storef(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.STOREB:
                            this.addInstruccion(new Storeb(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.DUP:
                        case Lenguaje.DUPI:
                            this.addInstruccion(new Dup(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.DUPF:
                            this.addInstruccion(new Dupf(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.DUPB:
                            this.addInstruccion(new Dupb(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.ADD:
                        case Lenguaje.ADDI:
                            this.addInstruccion(new Add(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.ADDF:
                            this.addInstruccion(new Addf(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.SUB:
                        case Lenguaje.SUBI:
                            this.addInstruccion(new Sub(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.SUBF:
                            this.addInstruccion(new Subf(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.DIV:
                        case Lenguaje.DIVI:
                            this.addInstruccion(new Div(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.DIVF:
                            this.addInstruccion(new Divf(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.MUL:
                        case Lenguaje.MULI:
                            this.addInstruccion(new Mul(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.MULF:
                            this.addInstruccion(new Mulf(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.MOD:
                            this.addInstruccion(new Mod(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.IN:
                        case Lenguaje.INI:
                            this.addInstruccion(new In(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.INF:
                            this.addInstruccion(new Inf(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.INB:
                            this.addInstruccion(new Inb(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.OUT:
                        case Lenguaje.OUTI:
                            this.addInstruccion(new Out(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.OUTF:
                            this.addInstruccion(new Outf(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.OUTB:
                            this.addInstruccion(new Outb(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.AND:
                            this.addInstruccion(new And(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.OR:
                            this.addInstruccion(new Or(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.NOT:
                            this.addInstruccion(new Not(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.GT:
                        case Lenguaje.GTI:
                            this.addInstruccion(new Gt(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.GTF:
                            this.addInstruccion(new Gtf(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.LT:
                        case Lenguaje.LTI:
                            this.addInstruccion(new Lt(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.LTF:
                            this.addInstruccion(new Ltf(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.GE:
                        case Lenguaje.GEI:
                            this.addInstruccion(new Ge(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.GEF:
                            this.addInstruccion(new Gef(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.LE:
                        case Lenguaje.LEI:
                            this.addInstruccion(new Le(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.LEF:
                            this.addInstruccion(new Lef(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.EQ:
                        case Lenguaje.EQI:
                            this.addInstruccion(new Eq(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.EQF:
                            this.addInstruccion(new Eqf(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.NE:
                        case Lenguaje.NEI:
                            this.addInstruccion(new Ne(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.NEF:
                            this.addInstruccion(new Nef(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.B2I:
                            this.addInstruccion(new B2i(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.I2B:
                            this.addInstruccion(new I2b(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.I2F:
                            this.addInstruccion(new I2f(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.F2I:
                            this.addInstruccion(new F2i(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.JMP:
                            var label = linea.trim().split(/\s+/)[1] + ":";
                            this.addInstruccion(new Jmp(this.contadorInstrucciones, label, this.programa), linea);
                            break;
                        case Lenguaje.JZ:
                            var label = linea.trim().split(/\s+/)[1] + ":";
                            this.addInstruccion(new Jz(this.contadorInstrucciones, label, this.programa), linea);
                            break;
                        case Lenguaje.JNZ:
                            var label = linea.trim().split(/\s+/)[1] + ":";
                            this.addInstruccion(new Jnz(this.contadorInstrucciones, label, this.programa), linea);
                            break;
                        case Lenguaje.CALL:
                            var label = linea.trim().split(/\s+/)[1] + ":";
                            this.addInstruccion(new Call(this.contadorInstrucciones, label, this.programa), linea);
                            break;
                        case Lenguaje.RET:
                            if (!this._finInit)
                                throw new Error("La función 'init' no puede contener otra función.");

                            this.addInstruccion(new Ret(this.contadorInstrucciones, this.programa), linea);
                            this._finFuncion = true; // Fin de la funcion actual leida
                            this._programaSinFunciones = false; // Hay mas funciones en el programa a parte de 'init'
                            break;
                        case Lenguaje.NOP:
                            this.addInstruccion(new Nop(this.contadorInstrucciones), linea);
                            break;
                        case Lenguaje.HALT:
                            this.addInstruccion(new Halt(this.contadorInstrucciones, this.programa), linea);
                            this._finInit = true; // Fin de la funcion principal 'init'
                            break;
                        case Lenguaje.WHITE_LINE:
                            // Al hacer trim() cualquier linea vacia (por muchos espacios que la formen) se convierte en ""
                            // asi se conserva la linea vacia y se interpretan todas igual.
                            this.programa.texto.push(new Linea(linea));
                            break;
                        default:
                            if (this.isComment(linea.trim()))
                                this.programa.texto.push(new Linea(linea));
                            else {
                                let label = linea.trim();
                                if (this.isValidLabel(label)) { // Es una etiqueta (o de funcion o de salto)
                                    this.programa.labels.push(new Label(label, this.contadorInstrucciones));
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
                });

                /** 
                 * Si la lectura del programa finaliza sin HALT, lo añade el sistema automaticamente,
                 * siempre y cuando no haya funciones de por medio. En tal caso su ausencia es un error de formacion.
                 */
                if (!this._finInit && this._programaSinFunciones) {
                    this.addInstruccion(new Halt(this.contadorInstrucciones, this.programa), Lenguaje.HALT.toLowerCase());
                    this._finInit = true; // Fin de la funcion principal 'init'
                }
                /**
                 * Si el parser lanza este error quiere decir que o la funcion principal no se cerro (falta un HALT y no se puede 
                 * añadir automaticamente al haber funciones de por medio) o algunas de las funciones
                 * secundarias no se cerro (falta al menos un RET) y por tanto, la ejecución nunca finalizaria.
                 */
                if (!this._finInit || !this._finFuncion)
                    throw new Error("La ejecución del programa nunca finaliza. Esto puede deberse a la falta de un HALT o RET en la función principal 'init' o"
                        + " en otra función, respectivamente.");

                this.programa.labelForInstruction();
                resolve(this.programa);
            };
            reader.readAsText(this.file);
            Consola.getInstance().addOutput(this.file.name); // Mostramos el nombre del fichero por consola.
        });
    }

    /**
     * Añade una instruccion al programa y aumenta el contador de instruccion
     * @param i Instruccion
     * @param linea Linea
     */
    private addInstruccion(i: Instruccion, linea: string) {
        if (this._finInit && this._finFuncion)
            throw new Error("No puede haber una instruccion que no forme parte de una función.\n'" + linea.trim() + "'.");

        this.programa.codigo.push(i);
        this.programa.texto.push(new Linea(linea, this.contadorInstrucciones));
        this.contadorInstrucciones++;
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