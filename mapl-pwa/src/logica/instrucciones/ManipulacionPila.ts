import { ByteDataType, DataType, FloatDataType, IntegerDataType } from '../util/DataTypes';
import { Stack } from '../util/Stack';
import { Instruccion } from './Instruccion';

export class Push extends Instruccion {
    cte: string;

    constructor(cte: string){ 
        super();
        this.cte = cte;
    }
    execute(stack: Stack<DataType>) {
        // +cadena --> para convertir una cadena que contiene un número en un número
        // Solo funciona si la cadena solo contiene caracteres numéricos, de lo contrario, devuelve NaN
        let dt = new IntegerDataType(+this.cte);
        stack.push(dt);
    }
}
export class Pushf extends Instruccion {
    cte: string;

    constructor(cte: string){ 
        super();
        this.cte = cte;
    }
    execute(stack: Stack<DataType>) {
        let dt = new FloatDataType(+this.cte);
        stack.push(dt);
    }
}
export class Pushb extends Instruccion {
    cte: string;

    constructor(cte: string){ 
        super();
        this.cte = cte;
    }
    execute(stack: Stack<DataType>) {
        let dt = new ByteDataType(+this.cte); 
        stack.push(dt);
    }
}
export class Pop extends Instruccion {
    execute(stack: Stack<DataType>) {
        if (!Number.isInteger(+stack.top().value))
            throw new Error("El valor de la instrucción no es un número entero.");
            
        stack.pop();
    }
}
export class Popf extends Instruccion {
    execute(stack: Stack<DataType>) {
        if (!isNaN(+stack.top().value))
            throw new Error("El valor de la instrucción no es un número real.");
            
        stack.pop();
    }
}
export class Popb extends Instruccion {
    execute(stack: Stack<DataType>) {
        if (!Number.isInteger(+stack.top().value))
            throw new Error("El valor de la instrucción no es un número entero.");
            
        stack.pop();
    }
}
export class Dup extends Instruccion {
    execute(stack: Stack<DataType>) {
        stack.push(stack.top());
    }
}