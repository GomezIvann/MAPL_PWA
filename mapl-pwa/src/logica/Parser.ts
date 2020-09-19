import { StaticSymbolResolver } from '@angular/compiler';
import { Add, Sub, Mul, Div } from './instrucciones/Aritmeticas';
import { Eq, Ge, Gt, Le, Lt, Ne } from './instrucciones/Comparaciones';
import { In, Out } from './instrucciones/EntradaSalida';
import { And, Not, Or } from './instrucciones/Logicas';
import { Push } from './instrucciones/ManipulacionPila';
import { Language } from './Language';
import { Program } from './Program';

export class Parser {
    file: File;

    constructor(file: File) {
        this.file = file;
    }

    read(): Program {
        var program = new Program();
        let reader = new FileReader();
        reader.onload = (e) => {
            let content = reader.result.toString().trim();
            let lines = content.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
            lines.forEach(line => {
                var firstWord = line.replace(/ .*/,'');
                switch (firstWord.toUpperCase()) {
                    case Language.PUSH:
                        var cte = line.replace(/^\D+/g,'');
                        program.codigo.push(new Push(parseInt(cte)));
                        break;
                    case Language.ADD:
                        program.codigo.push(new Add());
                        break;
                    case Language.SUB:
                        program.codigo.push(new Sub());
                        break;
                    case Language.DIV:
                        program.codigo.push(new Div());
                        break;
                    case Language.MUL:
                        program.codigo.push(new Mul());
                        break;
                    case Language.IN:
                        program.codigo.push(new In());
                        break;
                    case Language.OUT:
                        program.codigo.push(new Out());
                        break;
                    case Language.AND:
                        program.codigo.push(new And());
                        break;
                    case Language.OR:
                        program.codigo.push(new Or());
                        break;
                    case Language.NOT:
                        program.codigo.push(new Not());
                        break;
                    case Language.GT:
                        program.codigo.push(new Gt());
                        break;
                    case Language.LT:
                        program.codigo.push(new Lt());
                        break;
                    case Language.GE:
                        program.codigo.push(new Ge());
                        break;
                    case Language.LE:
                        program.codigo.push(new Le());
                        break;
                    case Language.EQ:
                        program.codigo.push(new Eq());
                        break;
                    case Language.NE:
                        program.codigo.push(new Ne());
                        break;
                    default:
                        console.log("No instruction found!");
                        break;
                }
            });
        }
        reader.readAsText(this.file);
        return program;
    }
}