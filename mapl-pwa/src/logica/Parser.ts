import { StaticSymbolResolver } from '@angular/compiler';
import { ɵConsole } from '@angular/core';
import { Add, Sub, Mul, Div } from './instrucciones/Aritmeticas';
import { Eq, Ge, Gt, Le, Lt, Ne } from './instrucciones/Comparaciones';
import { In, Out } from './instrucciones/EntradaSalida';
import { And, Not, Or } from './instrucciones/Logicas';
import { Dup, Pop, Push } from './instrucciones/ManipulacionPila';
import { Language } from './Language';
import { Linea, Program } from './Program';

export class Parser {
    file: File;

    constructor(file: File) {
        this.file = file;
    }

    /**
     * Resolve: Es la función que llamaremos si queremos resolver satisfactoriamente la promesa.
     * Reject: Es la función que llamaremos si queremos rechazar la promesa.
     */
    read(): Promise<Program> {
        var program = new Program();
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException("Problem parsing input file."));
            };

            reader.onload = (e) => {
                let lines = reader.result.toString().split("\n");
                var endLoop = false;
                var firstWord = "";
                var numberLine = "";
                var i = 0;

                // el metodo some se comporta igual que forEach, salvo que este se puede parar su ejecucion
                // para ello basta con retornar true cuando queramos pararla
                lines.some(line => {
                    // Expresion regular reemplaza todo un string por "" salvo la primera palabra que encuentra
                    // trim() elimina los espacios y terminadores de linea de un string
                    firstWord = line.replace(/ .*/, "").trim().toUpperCase();
                    numberLine = ("000" + i).slice(-4); // [0000, 0001, ..., 0010, ..., 0199, 9999]

                    switch (firstWord) {
                        case Language.PUSH:
                            var cte = line.replace(/^\D+/g, "");
                            program.code.push(new Push(parseInt(cte)));
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.POP:
                            program.code.push(new Pop());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.DUP:
                            program.code.push(new Dup());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.ADD:
                            program.code.push(new Add());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.SUB:
                            program.code.push(new Sub());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.DIV:
                            program.code.push(new Div());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.MUL:
                            program.code.push(new Mul());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.IN:
                            program.code.push(new In());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.OUT:
                            program.code.push(new Out());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.AND:
                            program.code.push(new And());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.OR:
                            program.code.push(new Or());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.NOT:
                            program.code.push(new Not());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.GT:
                            program.code.push(new Gt());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.LT:
                            program.code.push(new Lt());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.GE:
                            program.code.push(new Ge());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.LE:
                            program.code.push(new Le());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.EQ:
                            program.code.push(new Eq());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.NE:
                            program.code.push(new Ne());
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.NOP:
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        case Language.WHITE_LINE:
                            // al hacer trim() cualquier linea vacia (por muchos espacios que la formen) se convierte en ""
                            // asi se conserva la linea vacia y se interpretan todas igual
                            program.content.push(new Linea(line));
                            break;
                        case Language.HALT:
                            // finaliza la ejecucion del programa (no hace falta seguir leyendo)
                            endLoop = true;
                            program.content.push(new Linea(line, numberLine));
                            i++;
                            break;
                        default:
                            if (!this.isComment(line))
                                throw new Error("No instruction or comment found!\n" + line);
                            program.content.push(new Linea(line));
                    }
                    return endLoop;
                });
                resolve(program);
            };
            reader.readAsText(this.file);
        });
    }

    private isComment(line: string): boolean {
        return /^\'/.test(line);
    }
}