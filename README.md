# MAPL_PWA
**Trabajo de fin de carrera**. Reescribiendo la máquina didáctica MAPL como una PWA gracias al framework Angular.

## Juego de instrucciones
1. Manipulación de la pila:
   - pushb cte, pushi cte, pushf cte
   - loadb loadi loadf
   - storeb storei storef
   - popb popi popf
   - storeb storei storef
   - popb popi popf
   - dupb dupi dupf
2. Aritméticas:
   - addi addf
   - subi subf
   - muli mulf
   - divi divf
   - mod
3. Lógicas:
   - and
   - or
   - not
4. Comparación:
   - [>] gti gtf
   - [<] lti ltf
   - [>=] gei gef
   - [<=] lei lef
   - [==] eqi eqf
   - [!=] nei nef
5. E/S:
   - inb ini inf
   - outb outi outf
6. Conversiones:
   - i2b (int to byte)
   - b2i f2i (byte to int, float to int)
   - i2f (int to float)
7. Salto:
   - jmp label
   - jz label (jump if zero)
   - jnz label (jump if no zero)
8. Funciones
   - call label
   - ret cte1, cte2, cte3
   - enter cte
9. Otras:
   - halt
   - nop
