class Controls{
    constructor(type)
    {
        // four different attributes of a control class
        // initially set to false but change depending on what is pressed on
        // the keyboard
        this.forward=false;
        this.left=false;
        this.right=false;
        this.reverse=false;
        this.stop=false;

        //switch btn keys and dummy for vehicle and traffic motion
        switch(type){
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.forward=true;
                break;
        }

        //define method for adding keyboard listeners
        //this.#addKeyboardListeners();
    }

    //the # shows that its a private method, should 
    //not be accessed outside the controls class
    #addKeyboardListeners()
    {
        // checks keypress = onkeydown
        document.onkeydown=(event)=>
        { //=> function, referencing
            switch(event.key)
            {
                case "ArrowLeft":
                    this.left=true;
                    break;
                case "ArrowRight":
                    this.right=true;
                    break;
                case "ArrowUp":
                    this.forward=true;
                    break;
                case "ArrowDown":
                    this.reverse=true;
                    break;
                case " ":
                    this.stop=true;
                    break;
            }
            //debug
            //console.table(this); //output the event onkeydown to console
        }

        //check for key release = onkeyup
        document.onkeyup=(event)=>
        {
            switch(event.key)
            {
                case "ArrowLeft":
                    this.left=false;
                    break;
                case "ArrowRight":
                    this.right=false;
                    break;
                case "ArrowUp":
                    this.forward=false;
                    break;
                case "ArrowDown":
                    this.reverse=false;
                    break;
                case " ":
                    this.stop=false;
                    break;
            }
            //console.table(this);
        }

    }
}