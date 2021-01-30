class Controller {

    constructor(){
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._displayCalcEl = document.querySelector('#display');
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    copyToClipboard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();
    }

    pastFromClipboard(){
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
        })

    }

    initialize (){
        this.setLastNumbertoDisplay();
        this.pastFromClipboard();     
    }

    initKeyboard(){

        document.addEventListener('keyup', e =>{

            switch (e.key){

                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '%':
                case '/':
                case '*':
                    this.addOperation(e.key);
                break;
                case '=':
                case 'Enter':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
                break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':    
                case '9':
                    this.addOperation(parseInt(e.key));
                break;

                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                   
                    break;
    
            }


        });
    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);

        });

    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this.lastOperation = '';
        this.setLastNumbertoDisplay();
    }

    clearEntry(){
        this._operation.pop();
        this.setLastNumbertoDisplay();

    }

    getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    isOperator(value){
        return (['+','-','*','%','/'].indexOf(value) > -1);
    }

    setLastOperation(value){
        this._operation[this._operation.length-1] = value;

    }

    pushOperation(value){
        this._operation.push(value);

        if (this._operation.length > 3) {
            this.calc();
        }
    }

    getResult(){
        return eval(this._operation.join(""));
    } 

    calc(){

        let last ='';
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if(this._operation.length > 3) {
            last = this._operation.pop();
            this._lastNumber = this.getResult();
           
        } else if (this._operation.length == 3){
            this._lastNumber = this.getLastItem(false);
        }

                
        let result = this.getResult();

        if (last =='%'){
            result /= 100;
            this._operation = [result];
        } else {
            this._operation = [result];
            if (last) this._operation.push(last);
        }

        this.setLastNumbertoDisplay();

    }

    getLastItem(isOperator = true) {

        let lastItem;

        for (let i = this._operation.length-1; i >= 0; i--){
            if (this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            } 

        }
        
        if (!lastItem){
                lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;

    }

    setLastNumbertoDisplay(){

        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
        
    }

    addOperation(value){

        if(isNaN(this.getLastOperation())){
            //SE ÚLTIMO ITEM DO ARRAY NÃO FOR NÚMERO E O ÚLTIMO BOTÃO CLICADO FOR OPERADOR (ÚLTIMO OPERADOR É SUBSTITUIDO)
            if(this.isOperator(value)){
                this.setLastOperation(value);

            } else{
                //SE ÚLTIMA POSIÇÃO DO ARRAY FOR UNDEFINED 
                this.pushOperation(value);
                this.setLastNumbertoDisplay();
            }


        } else {
                //SE ÚLTIMO ITEM DO ARRAY FOR NÚMERO E O ÚLTIMO BOTÃO CLICADO FOR OPERADOR (ADD OPERADOR NA ÚLTIMA POSIÇÃO DO ARRAY)
            if (this.isOperator(value)){
                this.pushOperation(value);
            } else {
                //SE ÚLTIMO ITEM DO ARRAY FOR NÚMERO E O ÚLTIMO BOTÃO CLICADO FOR NÚMERO (CONCATENAR)
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                this.setLastNumbertoDisplay();
            }
            
        }

    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumbertoDisplay();

    }

    execBtn(value){

        switch (value){

            case 'AC':
                this.clearAll();
            break;
            case 'CE':
                this.clearEntry();
            break;
            case '+':
                this.addOperation('+');
            break;
            case '-':
                this.addOperation('-');
            break;
            case '%':
                this.addOperation('%');
            break;
            case '/':
                this.addOperation('/');
            break;
            case 'X':
                this.addOperation('*');
            break;
            case '=':
                this.calc();
            break;
            case '.':
                this.addDot();
            break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':    
            case '9':
                this.addOperation(parseInt(value));
            break;

        }

    }

    initButtonsEvents (){

        let buttons = document.querySelectorAll ("#keyboard > div > button");

        buttons.forEach(btn => {

            this.addEventListenerAll(btn, "click drag", e => {
                let txtBtn = btn.innerHTML; 
                this.execBtn(txtBtn);

            })

        });
        
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;

    }

    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;

    }



}