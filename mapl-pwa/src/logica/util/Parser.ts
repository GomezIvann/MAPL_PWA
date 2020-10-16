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

/**
 * Clase encargada de la lectura del fichero y generacion del programa a partir de este.
 */
export class Parser {
    file: File; // Fichero de entrada
    programa: Programa;

    constructor(file: File) {
        this.file = file;
        this.programa = new Programa();
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
                var finalBucle = false; // Determinara si hay una instruccion halt o no.
                var primeraPalabra = ""; // Primera palabra de la linea
                var numeroInstruccion = "0000"; // Cadena para el numero de instruccion
                var i = 0; // Contador para el numero de instruccion

                /**
                 * El metodo some se comporta igual que forEach, con la diferencia de que en este se
                 * puede parar su ejecucion con simplemente retornar true de acuerdo a la condicion que queramos
                 */
                lineas.some(linea => {
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
                     *          code;
                     * esto es exclusivo de Javascript.
                     */
                    switch (primeraPalabra) {
                        case Lenguaje.PUSH:
                        case Lenguaje.PUSHI:
                            // Divide la linea con cualquier caracter de espacio en blanco (igual a [\r\n\t\f\v])
                            var cte = linea.trim().split(/\s+/)[1];  // segunda palabra de la linea
                            this.programa.codigo.push(new Push(numeroInstruccion, cte));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.PUSHF:
                            var cte = linea.trim().split(/\s+/)[1];
                            this.programa.codigo.push(new Pushf(numeroInstruccion, cte));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.PUSHB:
                            var cte = linea.trim().split(/\s+/)[1];
                            this.programa.codigo.push(new Pushb(numeroInstruccion, cte));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.PUSHA:
                            var cte = linea.trim().split(/\s+/)[1];
                            this.programa.codigo.push(new Pusha(numeroInstruccion, cte));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.POP:
                        case Lenguaje.POPI:
                            this.programa.codigo.push(new Pop(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.POPF:
                            this.programa.codigo.push(new Popf(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.POPB:
                            this.programa.codigo.push(new Popb(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.LOAD:
                        case Lenguaje.LOADI:
                            this.programa.codigo.push(new Load(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.LOADB:
                            this.programa.codigo.push(new Loadb(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.LOADF:
                            this.programa.codigo.push(new Loadf(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.STORE:
                        case Lenguaje.STOREI:
                            this.programa.codigo.push(new Store(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.STOREB:
                            this.programa.codigo.push(new Storeb(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.STOREF:
                            this.programa.codigo.push(new Storef(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.DUP:
                        case Lenguaje.DUPI:
                            this.programa.codigo.push(new Dup(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.DUPF:
                            this.programa.codigo.push(new Dupf(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.DUPB:
                            this.programa.codigo.push(new Dupb(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.ADD:
                        case Lenguaje.ADDI:
                            this.programa.codigo.push(new Add(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.ADDF:
                            this.programa.codigo.push(new Addf(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.SUB:
                        case Lenguaje.SUBI:
                            this.programa.codigo.push(new Sub(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.SUBF:
                            this.programa.codigo.push(new Subf(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.DIV:
                        case Lenguaje.DIVI:
                            this.programa.codigo.push(new Div(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.DIVF:
                            this.programa.codigo.push(new Divf(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.MUL:
                        case Lenguaje.MULI:
                            this.programa.codigo.push(new Mul(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.MULF:
                            this.programa.codigo.push(new Mulf(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.MOD:
                            this.programa.codigo.push(new Mod(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.IN:
                        case Lenguaje.INI:
                            this.programa.codigo.push(new In(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.INF:
                            this.programa.codigo.push(new Inf(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.INB:
                            this.programa.codigo.push(new Inb(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.OUT:
                        case Lenguaje.OUTI:
                            this.programa.codigo.push(new Out(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.OUTB:
                            this.programa.codigo.push(new Outb(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.OUTF:
                            this.programa.codigo.push(new Outf(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.AND:
                            this.programa.codigo.push(new And(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.OR:
                            this.programa.codigo.push(new Or(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.NOT:
                            this.programa.codigo.push(new Not(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.GT:
                        case Lenguaje.GTI:
                            this.programa.codigo.push(new Gt(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.GTF:
                            this.programa.codigo.push(new Gtf(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.LT:
                        case Lenguaje.LTI:
                            this.programa.codigo.push(new Lt(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.LTF:
                            this.programa.codigo.push(new Ltf(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.GE:
                        case Lenguaje.GEI:
                            this.programa.codigo.push(new Ge(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.GEF:
                            this.programa.codigo.push(new Gef(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.LE:
                        case Lenguaje.LEI:
                            this.programa.codigo.push(new Le(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.LEF:
                            this.programa.codigo.push(new Lef(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.EQ:
                        case Lenguaje.EQI:
                            this.programa.codigo.push(new Eq(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.EQF:
                            this.programa.codigo.push(new Eqf(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.NE:
                        case Lenguaje.NEI:
                            this.programa.codigo.push(new Ne(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.NEF:
                            this.programa.codigo.push(new Nef(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.B2I:
                            this.programa.codigo.push(new B2i(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.I2B:
                            this.programa.codigo.push(new I2b(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.I2F:
                            this.programa.codigo.push(new I2f(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.F2I:
                            this.programa.codigo.push(new F2i(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.JMP:
                            var label = linea.trim().split(/\s+/)[1] + ":"; // segunda palabra de la linea
                            this.programa.codigo.push(new Jmp(numeroInstruccion, label, this.programa));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.JZ:
                            var label = linea.trim().split(/\s+/)[1] + ":";
                            this.programa.codigo.push(new Jz(numeroInstruccion, label, this.programa));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.JNZ:
                            var label = linea.trim().split(/\s+/)[1] + ":";
                            this.programa.codigo.push(new Jnz(numeroInstruccion, label, this.programa));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.NOP:
                            this.programa.codigo.push(new Nop(numeroInstruccion));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.HALT:
                            this.programa.codigo.push(new Halt(numeroInstruccion, this.programa));
                            this.programa.texto.push(new Linea(linea, numeroInstruccion));
                            // Finaliza la lectura del this.programa (no hace falta seguir leyendo).
                            finalBucle = true;
                            i++;
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
                                if (this.isValidLabel(label)) // Labels
                                    this.programa.labels.push(new Label(label, i));
                                else
                                    throw new Error("¡Ninguna intrucción o comentario legible para MAPL!\n'" + linea+"'.");
                            }
                    }
                    numeroInstruccion = ("000" + i).slice(-4); // [0000, 0001, ..., 0010, ..., 0199, 9999]
                    return finalBucle;
                });
                
                /**
                 * Si no se ha leido una instruccion HALT explicitamente se añade manualmente.
                 */
                if (!finalBucle) {
                    this.programa.codigo.push(new Halt(numeroInstruccion, this.programa));
                    this.programa.texto.push(new Linea(Lenguaje.HALT.toLowerCase(), numeroInstruccion));
                }
                
                this.programa.labelForInstruction();
                resolve(this.programa);
            };
            reader.readAsText(this.file);
            Consola.getInstance().addOutput(this.file.name); // Mostramos el nombre del fichero por consola.
        });
    }

    /**
     * True si la linea es una etiqueta y no existe ninguna con ese nombre ya en el programa.
     * @param linea 
     */
    private isValidLabel(linea: string): boolean {
        let label = this.programa.getLabelByNombre(linea);
        if (label !== undefined)
            throw new Error("Etiqueta repetida: '"+ linea+"'.");

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