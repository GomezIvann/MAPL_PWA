import { getLocaleNumberSymbol } from '@angular/common';
import { Add, Sub, Mul, Div, Addf, Subf, Mod, Divf, Mulf } from '../instrucciones/Aritmeticas';
import { Eq, Eqf, Ge, Gef, Gt, Gtf, Le, Lef, Lt, Ltf, Ne, Nef } from '../instrucciones/Comparaciones';
import { B2i, F2i, I2b, I2f } from '../instrucciones/Conversiones';
import { In, Inb, Inf, Out, Outb, Outf } from '../instrucciones/EntradaSalida';
import { And, Not, Or } from '../instrucciones/Logicas';
import { Dup, Pop, Push, Pushf, Pushb, Popb, Popf, Dupb, Dupf } from '../instrucciones/ManipulacionPila';
import { Halt, Nop } from '../instrucciones/Otras';
import { Jmp, Jnz, Jz } from '../instrucciones/Salto';
import { Label } from './Label';
import { Lenguaje } from './Lenguaje';
import { Linea, Programa } from './Programa';

export class Parser {
    file: File;

    constructor(file: File) {
        this.file = file;
    }

    /**
     * Resolve: Es la función que llamaremos si queremos resolver satisfactoriamente la promesa.
     * Reject: Es la función que llamaremos si queremos rechazar la promesa.
     */
    read(): Promise<Programa> {
        var programa = new Programa();
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException("Problema parseando el archivo de entrada."));
            };

            reader.onload = (e) => {
                let lineas = reader.result.toString().split("\n");
                var finalBucle = false;
                var primeraPalabra = "";
                var numeroInstruccion = "";
                var i = 0;

                /**
                 * El metodo some se comporta igual que forEach, salvo que este se puede parar su ejecucion
                 * para ello basta con retornar true cuando queramos pararla
                 */ 
                lineas.some(linea => {
                    /**
                     * Expresion regular reemplaza todo un string por "" salvo la primera palabra que encuentra
                     * trim() elimina los espacios y terminadores de linea de un string (ubicados ante y despues del texto)
                     * ej. "       hello  world       " --trim()--> "hello  world"
                     */
                    primeraPalabra = linea.trim().replace(/ .*/, "").toUpperCase();
                    numeroInstruccion = ("000" + i).slice(-4); // [0000, 0001, ..., 0010, ..., 0199, 9999]

                    /** 
                     * Cuando dos cases se comportan igual, como es el caso de las instrucciones XXX y XXX(I)
                     * los cases se colocan de seguido y ambas ejecutan el mismo codigo
                     *      case XXX:
                     *      case XXX(I):
                     *          code;
                     * esto es exclusivo de Javascript
                     */
                    switch (primeraPalabra) {
                        case Lenguaje.PUSH:
                        case Lenguaje.PUSHI:
                            // Divide la linea con cualquier caracter de espacio en blanco (igual a [\r\n\t\f\v])
                            var cte = linea.trim().split(/\s+/)[1];  // segunda palabra de la linea
                            programa.codigo.push(new Push(numeroInstruccion, cte));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.PUSHF:
                            var cte = linea.trim().split(/\s+/)[1];
                            programa.codigo.push(new Pushf(numeroInstruccion, cte));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.PUSHB:
                            var cte = linea.trim().split(/\s+/)[1];
                            programa.codigo.push(new Pushb(numeroInstruccion, cte));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.POP:
                        case Lenguaje.POPI:
                            programa.codigo.push(new Pop(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.POPF:
                            programa.codigo.push(new Popf(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.POPB:
                            programa.codigo.push(new Popb(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.DUP:
                        case Lenguaje.DUPI:
                            programa.codigo.push(new Dup(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.DUPF:
                            programa.codigo.push(new Dupf(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.DUPB:
                            programa.codigo.push(new Dupb(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.ADD:
                        case Lenguaje.ADDI:
                            programa.codigo.push(new Add(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.ADDF:
                            programa.codigo.push(new Addf(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.SUB:
                        case Lenguaje.SUBI:
                            programa.codigo.push(new Sub(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.SUBF:
                            programa.codigo.push(new Subf(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.DIV:
                        case Lenguaje.DIVI:
                            programa.codigo.push(new Div(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.DIVF:
                            programa.codigo.push(new Divf(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.MUL:
                        case Lenguaje.MULI:
                            programa.codigo.push(new Mul(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.MULF:
                            programa.codigo.push(new Mulf(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.MOD:
                            programa.codigo.push(new Mod(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.IN:
                        case Lenguaje.INI:
                            programa.codigo.push(new In(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.INF:
                            programa.codigo.push(new Inf(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.INB:
                            programa.codigo.push(new Inb(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.OUT:
                        case Lenguaje.OUTI:
                            programa.codigo.push(new Out(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.OUTB:
                            programa.codigo.push(new Outb(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.OUTF:
                            programa.codigo.push(new Outf(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.AND:
                            programa.codigo.push(new And(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.OR:
                            programa.codigo.push(new Or(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.NOT:
                            programa.codigo.push(new Not(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.GT:
                        case Lenguaje.GTI:
                            programa.codigo.push(new Gt(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.GTF:
                            programa.codigo.push(new Gtf(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.LT:
                        case Lenguaje.LTI:
                            programa.codigo.push(new Lt(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.LTF:
                            programa.codigo.push(new Ltf(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.GE:
                        case Lenguaje.GEI:
                            programa.codigo.push(new Ge(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.GEF:
                            programa.codigo.push(new Gef(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.LE:
                        case Lenguaje.LEI:
                            programa.codigo.push(new Le(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.LEF:
                            programa.codigo.push(new Lef(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.EQ:
                        case Lenguaje.EQI:
                            programa.codigo.push(new Eq(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.EQF:
                            programa.codigo.push(new Eqf(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.NE:
                        case Lenguaje.NEI:
                            programa.codigo.push(new Ne(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.NEF:
                            programa.codigo.push(new Nef(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.B2I:
                            programa.codigo.push(new B2i(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.I2B:
                            programa.codigo.push(new I2b(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.I2F:
                            programa.codigo.push(new I2f(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.F2I:
                            programa.codigo.push(new F2i(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.JMP:
                            var label = linea.trim().split(/\s+/)[1] + ":"; // segunda palabra de la linea
                            programa.codigo.push(new Jmp(numeroInstruccion, label, programa));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.JZ:
                            var label = linea.trim().split(/\s+/)[1] + ":";
                            programa.codigo.push(new Jz(numeroInstruccion, label, programa));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.JNZ:
                            var label = linea.trim().split(/\s+/)[1] + ":";
                            programa.codigo.push(new Jnz(numeroInstruccion, label, programa));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.NOP:
                            programa.codigo.push(new Nop(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            i++;
                            break;
                        case Lenguaje.HALT:
                            programa.codigo.push(new Halt(numeroInstruccion));
                            programa.texto.push(new Linea(linea, numeroInstruccion));
                            // Finaliza la lectura del programa (no hace falta seguir leyendo)
                            finalBucle = true;
                            i++;
                            break;
                        case Lenguaje.WHITE_LINE:
                            // Al hacer trim() cualquier linea vacia (por muchos espacios que la formen) se convierte en ""
                            // asi se conserva la linea vacia y se interpretan todas igual
                            programa.texto.push(new Linea(linea));
                            break;
                        default:
                            if (!this.isComment(linea.trim())) {
                                // Labels
                                if (this.isLabel(linea.trim()))
                                    programa.labels.push(new Label(linea.trim(), i));
                                else
                                    throw new Error("¡Ninguna intrucción o comentario legible para MAPL!\n" + linea);
                            }
                            else
                                programa.texto.push(new Linea(linea));
                    }
                    return finalBucle;
                });
                if (!finalBucle) {
                    programa.codigo.push(new Halt(numeroInstruccion));
                    programa.texto.push(new Linea(Lenguaje.HALT.toLowerCase(), numeroInstruccion));
                }
                resolve(programa);
            };
            reader.readAsText(this.file);
        });
    }

    private isLabel(linea: string): boolean {
        return linea.endsWith(":");
    }

    private isComment(linea: string): boolean {
        return /^\'/.test(linea);
    }
}