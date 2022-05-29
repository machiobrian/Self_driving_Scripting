class Road
{
    constructor(x,width,laneCount=2) //center it on the x and let it have a width
    {
        //its attributes
        this.x=x;
        this.width=width;
        this.laneCount=laneCount;

        this.left=x-width/2; //pre-compute , to be used later
        this.right=x+width/2;

        //have the road go beyond
        const infinity=100000;
        this.top = -infinity;
        this.bottom=infinity;

        const topLeft={x:this.left,y:this.top}; // the topleft corner of the road
        const topRight={x:this.right,y:this.top};
        const bottomLeft={x:this.left,y:this.bottom};
        const bottomRight={x:this.right,y:this.bottom};

        this.boarders = [
            //defining the zone of operation/ driving
            //two segments made of two points each
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ];

    }

    ///define a function that will always position the vehicle ay the center of a
    //given lane 
    getLaneCenter(laneIndex)
    {
        const laneWidth=this.width/this.laneCount; // get the width measurement of the
                            // lane
        return this.left+laneWidth/2+
            Math.min(laneIndex,this.laneCount-1)*laneWidth;
    }

    //draw the road
    draw(ctx)
    {
        ctx.lineWidth=5;
        ctx.strokeStyle="white";

        for(let i=1; i<=this.laneCount-1;i++)
        {
            const x = lerp(
                this.left,
                this.right,
                i/this.laneCount
            );
            
            ctx.setLineDash([20,20]); //20 pixels break and dash
            ctx.beginPath();
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();

        }

        ctx.setLineDash([]);
        this.boarders.forEach(boarder=>
            {
                ctx.beginPath();
                ctx.moveTo(boarder[0].x,boarder[0].y); //move to the first point in the
                        //boarder
                ctx.lineTo(boarder[1].x, boarder[1].y); //second point
                ctx.stroke();
            });

    /*  
        // draw end-lanes manually

        ctx.beginPath();
        ctx.moveTo(this.left,this.top);
        ctx.lineTo(this.left,this.bottom);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.right,this.top);
        ctx.lineTo(this.right,this.bottom);
        ctx.stroke();
    */
    }

}

