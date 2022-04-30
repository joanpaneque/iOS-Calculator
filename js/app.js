// Objecte que controla les funcions de la calculadora
class Calculator {
    constructor(
        grid,
        buttons,
        calculator,
        display,
        mode_toggle,
        ac,
        division,
        multiplication,
        subtraction,
        addition,
        ee,
        secondary,
        zx,
        nx,
        ln,
        log10,
        sin,
        cos,
        tan,
        sinh,
        cosh,
        tanh,
        xy,
        ysqrtx,
        radian_display,
        radian_button,
        memory_recall
    ) {
        // VARIABLES PER LA MANIPULACIÓ DEL DOM
        this.grid = grid
        this.buttons = buttons
        this.calculator = calculator
        this.display = display
        this.mode_toggle = mode_toggle
        this.ac = ac
        this.division = division
        this.multiplication = multiplication
        this.subtraction = subtraction
        this.addition = addition
        this.ee = ee
        this.secondary = secondary
        this.zx = zx
        this.nx = nx
        this.ln = ln
        this.log10 = log10
        this.sin = sin
        this.cos = cos
        this.tan = tan
        this.sinh = sinh
        this.cosh = cosh
        this.tanh = tanh
        this.xy = xy
        this.ysqrtx = ysqrtx
        this.radian_display = radian_display
        this.radian_button = radian_button
        this.memory_recall = memory_recall

        this.radians = false
        this.secondaryFunctions = false
        this.mem_num = ''

        this.clear()
        this.update()

        // ACTUALIZACIÓ DE LA CALCULADORA
        this.grid.addEventListener('click', () => {
            this.update(true)
        })

        this.mode_toggle.addEventListener('click', () => {
            this.update(false)
        })
    }

    /* NETEJA COMPLETA O D'OPERADOR */
    clear() {


        //NETEJA COMPLETA
        if (this.ac.innerText === 'AC') {
            this.bufferNumber = ''
            this.operating = false
            this.operation = ''
            this.bufferOperation = ''
            this.bufferOperationCarry = ''
            this.forceAC = false
        }
    
        // NETEJA D'OPERADOR
        this.intNumber = ''
        this.comma = ''
        this.floatNumber = ''
        this.negation = false
        this.forceC = false
        if (this.bufferOperation !== '') this.forceAC = true
    }


    /* CADENA DE TEXT A LLENGUATGE DE CALCULADORA PER QUE HO PUGUI MOSTRAR PER PANTALLA */

            /* El nombre que es mostra a la calculadora està dividit en 3 variables:

                intNumber = El nombre enter. És a dir 25 en cas de que el nombre complet sigui 25,34
                comma = La coma del nombre. En cas de que hi hagi coma: ',', en cas de que no: ''
                floatNumber = El nombre decimal. És a dir 34 en cas de que el nombre complet sigui 25,34

                El motiu per aquesta divisió de variables es deu a dues raons:

                    * Evitar que les comes es repeteixin
                    * Poder mostrar els nombres correctament mentre s'escriuen progressivament
        */
    stringToInternalNum(string) {

        let _string = string

        if (typeof string === 'number') _string = _string.toPrecision(12) / 1
        _string = _string.toString().replace('.', ',').split(',')

        if (_string.length === 2) {
            this.intNumber = _string[0]
            this.comma = ','
            this.floatNumber = _string[1]
            return
        }

        this.intNumber = _string[0]
        this.comma = ''
        this.floatNumber = ''
    }

    // RETORNA EL NOMBRE QUE ESTÀ ESCRIT A LA CALCULADORA
    internalNumToString() {

        /*
            La coma la intercanvio per un punt per poder fer operacions
            amb decimals sense obtenir cap error al parsejar el decimal
        */
        return `${this.intNumber}${this.comma}${this.floatNumber}`.replace(',', '.')
    }


    // SUBSTITUIR EL NOMBRE DE LA CALCULADORA PER UN ALTRE
    replaceNumber(number) {
        /* 
            Utilitzo aquest mètode per escriure nombres de la calculadora científica
        */
        this.appendNumber(NaN)
        this.clear()
        this.appendNumber(number)
    }


    // ELIMINAR L'ÚLTIM CARÀCTER DE LA CALCULADORA
    slice() {
        /*
            No utilitzo aquest mètode en cap moment però el vaig implementar per si algun dia
            afegeixo la opció de borrar numeros
        */
        this.stringToInternalNum(this.internalNumToString().slice(0, -1))
    }

    // COMPROVA SI S'ESTÀ OPERANT ENTRE PARENTESI
    checkBrackets() {

        /*
            Aquest mètode calcula totes les operacions que estàn a dins d'un parentesi
        */
        if (this.pstart && this.pend && this.pvalid) {
            this.pvalid = false
            this.ignoreChaining = true
            this.compute()
            this.pstart = false
        }
        this.pend = false
    }

    /* CÀLCUL LÒGIC D'OPERACIONS */

    compute(misc_function) {



        /*
            Funció recursiva per calcular el factorial d'un nombre
        */
        let factorial = x => {
            if (x === 0) return 1
            return x * factorial(x - 1)
        }


        // CÀLCULS QUE NOMÉS REQUEREIXEN UNA VARIABLE

        if (misc_function === 'neg') {
            let floatingPoint = ''
            if (this.internalNumToString().charAt(this.internalNumToString().length - 1) === '.') floatingPoint = '.'
            this.stringToInternalNum(this.internalNumToString() / -1 + floatingPoint)
            this.negation = !this.negation
            return
        }

        if (misc_function === '1divx') return this.stringToInternalNum(1 / this.internalNumToString())
        if (misc_function === 'div100') return this.stringToInternalNum(this.internalNumToString() / 100)
        if (misc_function === 'x2') return this.stringToInternalNum(Math.pow(this.internalNumToString(), 2))
        if (misc_function === 'x3') return this.stringToInternalNum(Math.pow(this.internalNumToString(), 3))
        if (misc_function === 'x!') return this.stringToInternalNum(factorial(this.internalNumToString()))
        if (misc_function === 'ex') return this.stringToInternalNum(Math.pow(Math.E,this.internalNumToString()))
        if (misc_function === '10x') return this.stringToInternalNum(Math.pow(10,this.internalNumToString()))
        if (misc_function === '2x') return this.stringToInternalNum(Math.pow(2, this.internalNumToString()))
        if (misc_function === '2sqrtx') return this.stringToInternalNum(Math.sqrt(this.internalNumToString()))
        if (misc_function === '3sqrtx') return this.stringToInternalNum(Math.cbrt(this.internalNumToString()))
        if (misc_function === 'ln') return this.stringToInternalNum(Math.log(this.internalNumToString()))
        if (misc_function === 'log2') return this.stringToInternalNum(Math.log(this.internalNumToString()) / Math.log(2))
        if (misc_function === 'log10') return this.stringToInternalNum(Math.log(this.internalNumToString()) / Math.log(10))
        if (misc_function === 'sinh') return this.stringToInternalNum(Math.sinh(this.internalNumToString()))
        if (misc_function === 'cosh') return this.stringToInternalNum(Math.cosh(this.internalNumToString()))
        if (misc_function === 'tanh') return this.stringToInternalNum(Math.tanh(this.internalNumToString()))
        if (misc_function === 'asinh') return this.stringToInternalNum(Math.asinh(this.internalNumToString()))
        if (misc_function === 'acosh') return this.stringToInternalNum(Math.acosh(this.internalNumToString()))
        if (misc_function === 'atanh') return this.stringToInternalNum(Math.atanh(this.internalNumToString()))


        /*
            La calculadora implementa la opció de calcular els angles en radians o en graus
        */
        if (this.radians) {
            if (misc_function === 'sin') return this.stringToInternalNum(Math.sin(this.internalNumToString()))
            if (misc_function === 'cos') return this.stringToInternalNum(Math.cos(this.internalNumToString()))
            if (misc_function === 'tan') return this.stringToInternalNum(Math.tan(this.internalNumToString()))
            if (misc_function === 'asin') return this.stringToInternalNum(Math.asin(this.internalNumToString()))
            if (misc_function === 'acos') return this.stringToInternalNum(Math.acos(this.internalNumToString()))
            if (misc_function === 'atan') return this.stringToInternalNum(Math.atan(this.internalNumToString()))
        }

        if (misc_function === 'sin') return this.stringToInternalNum(Math.sin(this.internalNumToString() * Math.PI / 180))
        if (misc_function === 'cos') return this.stringToInternalNum(Math.cos(this.internalNumToString() * Math.PI / 180))
        if (misc_function === 'tan') return this.stringToInternalNum(Math.tan(this.internalNumToString() * Math.PI / 180))
        if (misc_function === 'asin') return this.stringToInternalNum(Math.asin(this.internalNumToString() * Math.PI / 180))
        if (misc_function === 'acos') return this.stringToInternalNum(Math.acos(this.internalNumToString() * Math.PI / 180))
        if (misc_function === 'atan') return this.stringToInternalNum(Math.atan(this.internalNumToString() * Math.PI / 180))


        // SEGUIMENT D'OPERACIONS SEQUENCIALS


        /*
            El seguiment de les operacions sequencials comença quan es fa una operació de dues variables.

            Per operar sequencialment s'ha de fer una operació de dues variables i seguidament prèmer el botó '=',
            d'aquesta manera llegirà la última operació i la tornarà a executar amb el valor actual
        */ 

        if (this.internalNumToString() === '' || this.displayOperator) {
            this.bufferNumber = this.internalNumToString()
        }

        if (this.operation === '') {
            if (this.ignoreChaining) return this.ignoreChaining = false
            if (this.bufferNumber === '') return
            if (this.internalNumToString() === '') this.stringToInternalNum('0')
            this.operation = this.bufferOperation
            this.bufferNumber = this.internalNumToString()
            this.stringToInternalNum(this.bufferOperationCarry)
        } else {
            this.bufferOperation = this.operation
            this.bufferOperationCarry = this.internalNumToString()
        }

        // OPERACIONS QUE REQUEREIXEN DUES VARIABLES

        if (this.operation === 'division') this.stringToInternalNum(this.bufferNumber / this.internalNumToString())
        if (this.operation === 'multiplication') this.stringToInternalNum(this.internalNumToString() * this.bufferNumber)
        if (this.operation === 'subtraction') this.stringToInternalNum(this.bufferNumber - this.internalNumToString())
        if (this.operation === 'addition') this.stringToInternalNum(parseFloat(this.internalNumToString()) + parseFloat(this.bufferNumber))
        if (this.operation === 'ee') this.stringToInternalNum(this.internalNumToString().padEnd(parseInt(this.internalNumToString()) + 1, '0'))
        if (this.operation === 'xy') this.stringToInternalNum(Math.pow(this.bufferNumber,this.internalNumToString()))
        if (this.operation === 'yx') this.stringToInternalNum(Math.pow(this.internalNumToString(),this.bufferNumber))
        if (this.operation === 'ysqrtx') this.stringToInternalNum(Math.pow(this.bufferNumber,1/this.internalNumToString()))
        if (this.operation === 'logy') this.stringToInternalNum(Math.log(this.bufferNumber) / Math.log(this.internalNumToString()))


        // FINALITZACIÓ DEL CÀLCUL

        this.operation = ''
        this.displayOperator = false
        if (this.internalNumToString() === '0') { this.forceC = true; this.negation = false }


    }


    /* ADDICIÓ DE NOMBRES A LA CALCULADORA */

    appendNumber(number) {

        if (!this.scientific && this.internalNumToString().length >= 9) return
        if (this.scientific && this.internalNumToString().length >= 12) return
        if (this.internalNumToString().includes('.') && number === ',' && calculator.operation === '') return
        let floatingPoint = number === ',' ? ',' : ''
        let _number = number.toString().replace('.', ',')


        if (this.operation !== '' && !this.operating) {
            this.displayOperator = false
            this.bufferNumber = this.internalNumToString()
            this.clear()
            this.operating = true
            if (floatingPoint === ',') this.stringToInternalNum('0,')
        }

        if (this.comma === ',') _number = _number.split(',').join('')
        if (this.internalNumToString() === '' && _number === ',') _number = '0,'

        _number = this.internalNumToString() + _number

        this.stringToInternalNum(_number)
        if (this.negation) this.stringToInternalNum((Math.abs(_number.split(',').join('')) / -1) + floatingPoint)

        if (this.pstart) this.pvalid = true
    }

    // SELECCIONA LA OPERACIÓ QUE S'HA PREMUT
    chooseOperation(operator) {

        if (this.operating && !this.displayOperator) {
            this.compute()
        }

        if (this.operation === operator) {
            this.operation = ''
            return
        }
        this.displayOperator = true
        this.bufferOperation = ''
        this.operation = operator
        this.operating = false
    }

    // CONTROL DE LES FUNCIONS DE LA MEMÒRIA
    memory(action) {
        if (action === 'add') this.mem_num = this.internalNumToString() / 1
        if (action === 'subtract') this.mem_num = this.internalNumToString() / -1
        if (action === 'clear') this.mem_num = ''
        if (action === 'recall' && this.mem_num !== '') this.stringToInternalNum(this.mem_num)
    }

    // ALTERNA LA FUNCIÓ DELS BOTONS CIENTÍFICS
    toggleScientificFunctions() {
        this.secondaryFunctions = !this.secondaryFunctions
        if (['yx','logy'].includes(this.operation)) this.operation = ''
    }

    // ALTERNA EL MODE DE CÀLCUL D'ANGLES
    toggleRadians() {
        this.radians = !this.radians
    }
    


    //ACTUALITZACIÓ VISUAL DE LA CALCULADORA
    /*
        La calculadora està programada d'una manera que primer fa totes les operacions lògiques que ha de fer al
        prèmer qualsevol botó i després fa el canvi visual.

        Aquesta manera de funcionar es deu a varis motius:

        * Fa que la calculadora sigui escalable
        * Permet arreglar errors visuals molt fàcilment
        * Impedeix que les funcions es solapin
        * Evita repetir codi
        * Millora la mantenibilitat del codi
        * Permet modificar la calculadora molt fàcilment
    */

    update(checkScrollWidth) {

        // ACTUALITZACIÓ DEL VISUALITZADOR, ELS BOTONS 'AC' I 'RADIANS I/O GRAUS'

        this.display.innerText = `${this.negation && ['0', '0.'].includes(this.internalNumToString()) ? '-' : ''}${parseFloat(this.intNumber).toLocaleString('ca-ES', { maximumFractionDigits: 20 })}${this.comma}${this.floatNumber}`
        if (this.intNumber === '') this.display.innerText = '0'
        !['', '0'].includes(this.internalNumToString()) ? this.ac.innerText = 'C' : this.ac.innerText = 'AC'
        if (this.forceAC) this.ac.innerText = 'AC'
        if (this.forceC) this.ac.innerText = 'C'
        this.radian_display.style.opacity = '0'
        this.radian_button.innerText = 'Rad'
        if (this.radians) {
            this.radian_button.innerText = 'Deg'
            this.radian_display.style.opacity = '1'
        }

        if (isNaN(this.internalNumToString()) || !isFinite(this.internalNumToString())) {
            this.display.innerText = 'Error'
            this.stringToInternalNum('0')
        }


        if (!this.scientific && this.internalNumToString().length > 9) {
            this.display.innerText = parsFloat(this.internalNumToString()).toFixed(9)
        }


        // ACTUALITZACIÓ DELS BOTONS CIENTÍFICS SECUNDARIS

        this.secondary.classList.remove('selected')
        this.memory_recall.classList.remove('selected')

        if (this.mem_num !== '') this.memory_recall.classList.add('selected')

        this.zx.innerHTML = "e<sup>x</sup>"
        this.nx.innerHTML = "10<sup>x</sup>"
        this.ln.innerHTML = "ln"
        this.log10.innerHTML = "log<sub>10</sub>"

        this.sin.innerHTML = "sin"
        this.cos.innerHTML = "cos"
        this.tan.innerHTML = "tan"
        this.sinh.innerHTML = "sinh"
        this.cosh.innerHTML = "cosh"
        this.tanh.innerHTML = "tanh"

        let secondaryTrigonometry = '<sup>-1</sup>'

        if (this.secondaryFunctions) {
            this.secondary.classList.add('selected')
            this.zx.innerHTML = "y<sup>x</sup>"
            this.nx.innerHTML = "2<sup>x</sup>"
            this.ln.innerHTML = "log<sub>y</sub>"
            this.log10.innerHTML = "log<sub>2</sub>"
            this.sin.innerHTML = this.sin.innerText + secondaryTrigonometry
            this.cos.innerHTML = this.cos.innerText + secondaryTrigonometry
            this.tan.innerHTML = this.tan.innerText + secondaryTrigonometry
            this.sinh.innerHTML = this.sinh.innerText + secondaryTrigonometry
            this.cosh.innerHTML = this.cosh.innerText + secondaryTrigonometry
            this.tanh.innerHTML = this.tanh.innerText + secondaryTrigonometry
        }

        // ACTUALITZACIÓ DELS OPERADORS

        this.division.classList.remove('selected')
        this.multiplication.classList.remove('selected')
        this.subtraction.classList.remove('selected')
        this.addition.classList.remove('selected')
        this.ee.classList.remove('selected')
        this.xy.classList.remove('selected')
        this.zx.classList.remove('selected')
        this.ysqrtx.classList.remove('selected')
        this.ln.classList.remove('selected')

        if (this.internalNumToString() === '' || this.displayOperator) {
            if (this.operation === 'division') this.division.classList.add('selected')
            if (this.operation === 'multiplication') this.multiplication.classList.add('selected')
            if (this.operation === 'subtraction') this.subtraction.classList.add('selected')
            if (this.operation === 'addition') this.addition.classList.add('selected')
            if (this.operation === 'ee') this.ee.classList.add('selected')
            if (this.operation === 'xy') this.xy.classList.add('selected')
            if (this.operation === 'ysqrtx') this.ysqrtx.classList.add('selected')

            if (this.secondaryFunctions) {
                if (this.operation === 'yx') this.zx.classList.add('selected')
                if (this.operation === 'logy') this.ln.classList.add('selected')
            }
        }



        // ACTUALITZACIÓ DE LA ALTERNACIÓ ENTRE EL MODE CIENTÍFIC I NORMAL

        this.scientific = this.mode_toggle.checked

        let rem = 'scientific'; let add = 'normal'
        if (this.scientific) { rem = 'normal'; add = 'scientific' }

        this.grid.classList.remove('button-grid-' + rem)
        this.grid.classList.add('button-grid-' + add)
        this.calculator.classList.remove('calculator-' + rem)
        this.calculator.classList.add('calculator-' + add)
        this.display.classList.remove('display-' + rem)
        this.display.classList.add('display-' + add)

        Array.from(this.buttons).forEach(button => {
            if (button.classList.contains('scientific')) {
                button.style.display = this.scientific ? 'flex' : 'none'
            }
            button.classList.add('button-' + add)
            button.classList.remove('button-' + rem)
        })



        // ACTUALITZACIÓ DEL TAMANY DE LA LLETRA DEL NOMBRE EN BASE AL SEU ESPAI

        if (!checkScrollWidth) return // Aquesta línia sembla inofensiva però evita que la calculadora peti
        let scroll = this.scientific ? 1059 : 390
        let fsize = 121
        do {
            fsize--
            this.display.style.fontSize = `${fsize}px`
        } while (this.display.scrollWidth > scroll)
        if (fsize < 120) this.display.style.fontSize = `${fsize}px`

    }
}

/* BOTONS QUE REQUEREIXEN MANIPULACIÓ DE DOM */
__CALCULATOR__ = document.querySelector('[calculator]')
__BUTTON_GRID__ = document.querySelector('[button-grid]')
__BUTTONS__ = __BUTTON_GRID__.getElementsByTagName('div')
__DISPLAY__ = document.querySelector('[display]')
__MODE_TOGGLE__ = document.querySelector('.form-switch').getElementsByTagName('input')[0]
__2ND__ = document.querySelector('[secnd]')
__ZX__ = document.querySelector('[zx]')
__NX__ = document.querySelector('[nx]')
__LN__ = document.querySelector('[ln]')
__LOG10__ = document.querySelector('[log10]')
__SIN__ = document.querySelector('[sin]')
__COS__ = document.querySelector('[cos]')
__TAN__ = document.querySelector('[tan]')
__SINH__ = document.querySelector('[sinh]')
__COSH__ = document.querySelector('[cosh]')
__TANH__ = document.querySelector('[tanh]')
__YSQRTX__ = document.querySelector('[ysqrtx]')
__RADIAN_DISPLAY__ = document.querySelector('[rad]')
__RADIAN_BUTTON__ = document.querySelector('[radian]')
__MEMORY_RECALL__ = document.querySelector('[mrecall]')


/* BOTONS QUE NO REQUEREIXEN MANIPULACIÓ DE DOM */
__NUMBERS__ = document.querySelectorAll('[number]')
__CLEAR__ = document.querySelector('[clear]')
__PERCENTAGE__ = document.querySelector('[div100]')
__PI__ = document.querySelector('[pi]')
__RANDOM__ = document.querySelector('[random]')
__E__ = document.querySelector('[e]')
__DIVISION__ = document.querySelector('[divide]')
__MULTIPLICATION__ = document.querySelector('[multiply]')
__SUBTRACTION__ = document.querySelector('[substract]')
__ADDITION__ = document.querySelector('[add]')
__EQUAL__ = document.querySelector('[equal]')
__EE__ = document.querySelector('[EE]')
__NEGATION__ = document.querySelector('[neg]')
__1DIVX__ = document.querySelector('[onedivx]')
__XFACTORIAL__ = document.querySelector('[xf]')
__X2__ = document.querySelector('[x2]')
__X3__ = document.querySelector('[x3]')
__XY__ = document.querySelector('[xy]')
__2SQRTX__ = document.querySelector('[twosqrtx]')
__3SQRTX__ = document.querySelector('[threesqrtx]')
__PSTART__ = document.querySelector('[pstart]')
__PEND__ = document.querySelector('[pend]')
__MEMORY_CLEAR__ = document.querySelector('[mc]')
__MEMORY_ADD__ = document.querySelector('[madd]')
__MEMORY_SUBSTRACT__ = document.querySelector('[msubs]')



// OBJECTE CALCULADORA
const calculator = new Calculator(
    __BUTTON_GRID__,
    __BUTTONS__,
    __CALCULATOR__,
    __DISPLAY__,
    __MODE_TOGGLE__,
    __CLEAR__,
    __DIVISION__,
    __MULTIPLICATION__,
    __SUBTRACTION__,
    __ADDITION__,
    __EE__,
    __2ND__,
    __ZX__,
    __NX__,
    __LN__,
    __LOG10__,
    __SIN__,
    __COS__,
    __TAN__,
    __SINH__,
    __COSH__,
    __TANH__,
    __XY__,
    __YSQRTX__,
    __RADIAN_DISPLAY__,
    __RADIAN_BUTTON__,
    __MEMORY_RECALL__
)


// DETECCIÓ DE CLICS


// BOTÓ 'AC / C'
__CLEAR__.addEventListener('click', () => {
    calculator.clear()
})



/* NOMBRES */
__NUMBERS__.forEach(number => number.addEventListener('click', () => {
    calculator.appendNumber(number.innerText)
}))

// NOMBRES CIENTÍFICS
__PI__.addEventListener('click', () => {
    calculator.replaceNumber(Math.PI)
})

__RANDOM__.addEventListener('click', () => {
    calculator.replaceNumber(Math.random())
})

__E__.addEventListener('click', () => {
    calculator.replaceNumber(Math.E)
})



/* OPERADORS */

__DIVISION__.addEventListener('click', () => {
    calculator.chooseOperation('division')
})

__MULTIPLICATION__.addEventListener('click', () => {
    calculator.chooseOperation('multiplication')
})

__SUBTRACTION__.addEventListener('click', () => {
    calculator.chooseOperation('subtraction')
})

__ADDITION__.addEventListener('click', () => {
    calculator.chooseOperation('addition')
})

__EE__.addEventListener('click', () => {
    calculator.chooseOperation('ee')
})

__XY__.addEventListener('click', () => {
    calculator.chooseOperation('xy')
})

__ZX__.addEventListener('click', () => {
    if (calculator.secondaryFunctions) {
        calculator.chooseOperation('yx')
    } else {
        calculator.compute('ex')
    }
})

__YSQRTX__.addEventListener('click', () => {
    calculator.chooseOperation('ysqrtx')
})

/* IGUAL ('=') */
__EQUAL__.addEventListener('click', () => {
    calculator.compute()
})


/* PARENTESI */
__PSTART__.addEventListener('click', () => {
    calculator.pstart = true
})

__PEND__.addEventListener('click', () => {
    calculator.pend = true
    calculator.checkBrackets()
})


/* FUNCTIONS DIVERSES */

__PERCENTAGE__.addEventListener('click', () => {
    calculator.compute('div100')
})

__NEGATION__.addEventListener('click', () => {
    calculator.compute('neg')
})

/* SCIENTIFIC MISC FUNCTIONS */

__1DIVX__.addEventListener('click', () => {
    calculator.compute('1divx')
})

__XFACTORIAL__.addEventListener('click', () => {
    calculator.compute('x!')
})

__X2__.addEventListener('click', () => {
    calculator.compute('x2')
})

__X3__.addEventListener('click', () => {
    calculator.compute('x3')
})

__NX__.addEventListener('click', () => {
    if (calculator.secondaryFunctions) {
        calculator.compute('2x')
    } else {
        calculator.compute('10x')
    }
})

__2SQRTX__.addEventListener('click', () => {
    calculator.compute('2sqrtx')
})

__3SQRTX__.addEventListener('click', () => {
    calculator.compute('3sqrtx')
})


/* OPERACIONS TRIGONOMÈTRIQUES */

__LN__.addEventListener('click', () => {
    if (calculator.secondaryFunctions) {
        calculator.chooseOperation('logy')
    } else {
        calculator.compute('ln')
    }
})

__LOG10__.addEventListener('click', () => {
    if (calculator.secondaryFunctions) {
        calculator.compute('log2')
    } else {
        calculator.compute('log10')
    }
})


__SIN__.addEventListener('click', () => {
    if (calculator.secondaryFunctions) {
        calculator.compute('asin')
    } else {
        calculator.compute('sin')
    }
})

__COS__.addEventListener('click', () => {
    if (calculator.secondaryFunctions) {
        calculator.compute('acos')
    } else {
        calculator.compute('cos')
    }
})

__TAN__.addEventListener('click', () => {
    if (calculator.secondaryFunctions) {
        calculator.compute('atan')
    } else {
        calculator.compute('tan')
    }
})

__SINH__.addEventListener('click', () => {
    if (calculator.secondaryFunctions) {
        calculator.compute('asinh')
    } else {
        calculator.compute('sinh')
    }
})

__COSH__.addEventListener('click', () => {
    if (calculator.secondaryFunctions) {
        calculator.compute('acosh')
    } else {
        calculator.compute('cosh')
    }
})

__TANH__.addEventListener('click', () => {
    if (calculator.secondaryFunctions) {
        calculator.compute('atanh')
    } else {
        calculator.compute('tanh')
    }
})


/* FUNCIONS CIENTÍFIQUES SECUNDÀRIES */

__2ND__.addEventListener('click', () => {
    calculator.toggleScientificFunctions()
})

__RADIAN_BUTTON__.addEventListener('click', () => {
    calculator.toggleRadians()
})

/* FUNCIONS DE LA MEMÒRIA */

__MEMORY_ADD__.addEventListener('click', () => {
    calculator.memory('add')
})

__MEMORY_SUBSTRACT__.addEventListener('click', () => {
    calculator.memory('subtract')
})

__MEMORY_CLEAR__.addEventListener('click', () => {
    calculator.memory('clear')
})

__MEMORY_RECALL__ .addEventListener('click', () => {
    calculator.memory('recall')
})