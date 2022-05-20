class Car{

    //define where we want the car to be x,y
    //define how big the car should be w,h
    constructor(x,y,width,height,controlType,maxSpeed=7)
    {
        //store them as attributes; properties, so that the car remembers how big 
        //it is and where it is
        //new changes
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        //to get an actual vehicle movement
        this.speed=0;
        this.acceleration=0.2;
        //define some friction for the vehicle
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        //to correct the right and left improper navigation; brick game like navigation
        this.damaged=false; //all cars are intially not damaged
        this.angle = 0;

        if(controlType!="DUMMY")
        {
            //if control type is not dummy, then equip with sensor
            this.sensor=new Sensor(this);
        }
        
        this.controls=new Controls(controlType); //constructor
    }

    update(roadBoarders,traffic)
    {
        //perfome move and assess damage and create polygon only if the vehicle is not
        //damaged -> if its damaged, it does not move
        if(!this.damaged)
        {
        this.#move();
        this.polygon=this.#createPolygon(); //the car will have a polygo attribute
                            // generated 
        this.damaged=this.#assessDamage(roadBoarders,traffic);
        }

        if(this.sensor){
            //if the sensor exists, update else, do nothing
        this.sensor.update(roadBoarders,traffic);
        }
    }

    #assessDamage(roadBoarders,traffic)
    {
        //loop through the boarders and check for intersection btn polygon 
        // and the road boarder -> true - damaged, else false - no damage hence normal
        for(let i=0;i<roadBoarders.length;i++)
        {
            if(polysIntersect(this.polygon,roadBoarders[i]))
            {
                return true;
            }
        }

        for(let j=0;j<traffic.length;j++)
        {
            if(polysIntersect(this.polygon,traffic[j].polygon))
            {
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);

        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    #move()
    {
        if(this.controls.forward)
        {
            //this.y-=2; //pixel movement; not similar to that of a car
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse)
        {
            //this.y+=2;
            this.speed-=this.acceleration;
        }
        if(this.speed>this.maxSpeed)
        {
            this.speed=this.maxSpeed; //capping the max values
        }
        if (this.speed < -this.maxSpeed)// have a slower reverse
        {
            this.speed =-this.maxSpeed;
        }

        // the effect of friction on speed; friction acts against or for
        if(this.speed>0){
            this.speed -= this.friction; // friction acts against speed
        }
        if(this.speed<0){
            this.speed += this.friction; // friction acts for speed; always increment
                    // by a factor of the friction -> the vehicle will never stop
        }
        /* with the above sequence, the vehicle will always be in constant +0.05 
        motion as a result of the this.speed<0 condition therefore to stop the continuos
        motion*/ 
        if(Math.abs(this.speed)<this.friction)
        {
            this.speed=0;
        }
        //this.y -= this.speed;

        // Add a flip function so that when the vehicle is turned in reverse, the 
        // execution of the buttons right and left are mirrored
        if(this.speed!=0)
        {
            const flip=this.speed>0?1:-1; //let it turn like a vehicle being driven
                        // not like a tank or a mecanum wheeled mobile robot
            if(this.controls.left)
        {
            //this.x-=2; //brickgame like motion
            this.angle+=0.03*flip; //increase angle by a certain factor
        }
        if(this.controls.right)
        {
            //this.x+= 2;
            this.angle-=0.03*flip;
        }

        }
        
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx)
    {
        /* After introducing the Polygon, we remove the instance of drawing the rectangle using
        translations and rotations */
        /*
        ctx.save(); //save the context
        ctx.translate(this.x, this.y); //translate to the point we want the rotation to be
                // centered at 
        ctx.rotate(-this.angle); //inform the ctx to rotate by minus this.angle
        ctx.beginPath();
        //define it as a rectangle
        ctx.rect(
            //this.x - this.width/2,
            -this.width/2, 
            //this.y - this.height/2,
            -this.height/2,
            this.width,
            this.height
            
        );
        ctx.fill();
        ctx.restore();
        */
       //let us chek for damage using color change of vehicle

       if(this.damaged)
       {
           ctx.fillStyle="red";
       }else{
           ctx.fillStyle="black";
       }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y); //moves to the 
                        // first points of the polygon
        //loop through all the points, locate them then fill them up
        for(let i =1;i<this.polygon.length;i++)
        {
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();

        if(this.sensor){
            //if the sensor exists, then draw its rays
        this.sensor.draw(ctx)       
        }
    }
}