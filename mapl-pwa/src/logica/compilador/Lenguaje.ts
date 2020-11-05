/**
 * Instrucciones entendibles por el programa.
 */
export enum Lenguaje {
    PUSH = "PUSH",
    PUSHI = "PUSHI",
    PUSHF = "PUSHF",
    PUSHB = "PUSHB",
    PUSHA = "PUSHA",
    LOAD = "LOAD",
    LOADI = "LOADI",
    LOADB = "LOADB",
    LOADF = "LOADF",
    STORE = "STORE",
    STOREI = "STOREI",
    STOREB = "STOREB",
    STOREF = "STOREF",
    POP = "POP",
    POPI = "POPI",
    POPF = "POPF",
    POPB = "POPB",
    DUP = "DUP",
    DUPI = "DUPI",
    DUPF = "DUPF",
    DUPB = "DUPB",
    ADD = "ADD",
    ADDI = "ADDI",
    ADDF = "ADDF",
    SUB = "SUB",
    SUBI = "SUBI",
    SUBF = "SUBF",
    MUL = "MUL",
    MULI = "MULI",
    MULF = "MULF",
    DIV = "DIV",
    DIVI = "DIVI",
    DIVF = "DIVF",
    MOD = "MOD",
    IN = "IN",
    INI = "INI",
    INF = "INF",
    INB = "INB",
    OUT = "OUT",
    OUTI = "OUTI",
    OUTF = "OUTF",
    OUTB = "OUTB",
    AND = "AND",
    OR = "OR",
    NOT = "NOT",
    GT = "GT",
    GTI = "GTI",
    GTF = "GTF",
    LT = "LT",
    LTI = "LTI",
    LTF = "LTF",
    GE = "GE",
    GEI = "GEI",
    GEF = "GEF",
    LE = "LE",
    LEI = "LEI",
    LEF = "LEF",
    EQ = "EQ",
    EQI = "EQI",
    EQF = "EQF",
    NE = "NE",
    NEI = "NEI",
    NEF = "NEF",
    B2I = "B2I",
    I2B = "I2B",
    I2F = "I2F",
    F2I = "F2I",
    JMP = "JMP",
    JZ = "JZ",
    JNZ = "JNZ",
    CALL = "CALL",
    ENTER = "ENTER",
    RET = "RET",
    NOP = "NOP",
    HALT = "HALT",
    WHITE_LINE = "",
    VAR = "#VAR",
    DATA = "#DATA",
    GLOBAL = "#GLOBAL",
    STRUCT = "#STRUCT",
    TYPE = "#TYPE"
}

export enum Tipos {
    INTEGER = "INT",
    REAL = "REAL",
    FLOAT = "FLOAT",
    BYTE = "BYTE",
    CHAR = "CHAR",
    ADDRESS = "ADDRESS"
}