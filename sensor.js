class Sensor{
    constructor(car)
    {
        this.car=car;
        this.rayCount=35;
        this.rayLength=100;
        this.raySpread=Math.PI/2;
        this.rays=[];
        this.readings=[]; //create an array to detect/how far road boarders are
    }

    update(roadBoarders)
    {
        this.#castRays();

        this.readings=[];
        //itterate through the rays
        for (let i=0;i<this.rays.length;i++)
        {
            this.readings.push(
                this.#getReadings(this.rays[i],roadBoarders)
            );
        }

    }

    #getReadings(rays,roadBoarders)
    {
        //method takes arrays and boarders as params
        //where it touches the boarders
        let touches=[];
        for(let i=0;i<roadBoarders.length;i++)
        {
            const touch=getIntersection(
                rays[0],
                rays[1],
                roadBoarders[i][0],
                roadBoarders[i][1]
            );
            if(touch) //if a touch exists, add to our touches
            {
                touches.push(touch);
            }
            //if segments don't intersect, don't add anything NULL
        }

        for(let i=0;i<traffic.length;i++)
        {
            const poly=traffic[i].polygon;
            for(let j=0;j<poly.length;j++)
            {
                const value=getIntersection(
                    rays[0],
                    rays[1],
                    poly[j],
                    poly[(j+1)%poly.length]
                );
                if(value)
                {
                    touches.push(value);
                }
            }
        }
        //if we have absolutely no touches with the given array
        if(touches.length==0)
        {
            //there's no reading
            return null;
        }else{
            //get intersection returns an x,y,offset-how far the point is from 
            //ray 0

            //return all the offsets.... get the minimum offset/nearest
            const offsets=touches.map(e=>e.offset);
            const minOffset=Math.min(...offsets); //minimum doesn't take in an array as I/p
            // but doea take in many values hence the ... spreads the array into many individual 
            //value
            return touches.find(e=>e.offset==minOffset); //return the touch with minimum Offser
        }
    }

    #castRays()
    {
        this.rays=[];
        for(let i=0;i<this.rayCount;i++)
        {
            //having a rayCount of 1 requires additional function else the 
            //-1 function returns a divide by 0; no ray displayed
            const rayAngle=lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1?0.5:i/(this.rayCount-1)
            )+this.car.angle;

            const start={x:this.car.x, y:this.car.y};
            const end={
                x:this.car.x-
                    Math.sin(rayAngle)*this.rayLength,
                y:this.car.y-
                    Math.cos(rayAngle)*this.rayLength
                };
            this.rays.push([start,end]);
        }
    }

    draw(ctx)
    {
        for(let i=0;i<this.rayCount;i++)
        {
            let end=this.rays[i][1];
            if(this.readings[i])
            {
                end=this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="orange";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                //this.rays[i][1].x,
                //this.rays[i][1].y
                end.x,
                end.y
            );
            ctx.stroke();
            //visualize where the lines might have reached
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="gray";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                //this.rays[i][1].x,
                //this.rays[i][1].y
                end.x,
                end.y
            );

            ctx.stroke();
        }
    }
}