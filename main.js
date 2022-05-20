const canvas=document.getElementById("myCanvas");

canvas.width=200;

const ctx = canvas.getContext("2d"); //ctx = context
const road = new Road(canvas.width/2,canvas.width*0.9);

// manually position the vehicle at the center always
//const car = new Car(100,100,30,50); //pixel position, width.height

//position the vehicle at the center based on the number of the lane
const car = new Car(road.getLaneCenter(3),100,30,50,"KEYS"); //have this vehicle 
                                        //controllable
//car.draw(ctx);
const traffic = [
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",1) //vehilce infront of the ego
];
// animate motion control

animate(); //create the animate function

function animate()
{
    for(let i=0;i<traffic.length;i++)
    {
        //go through every vehicle and let them take note of the boarders
        traffic[i].update(road.boarders,[]);
    }
    car.update(road.boarders,traffic);
    canvas.height=window.innerHeight;

    ctx.save()
    ctx.translate(0,-car.y+canvas.height*0.7);

    road.draw(ctx); // have the road come before the car
    for(let i=0;i<traffic.length;i++) //draw the traffic on the road
    {
        traffic[i].draw(ctx);
    }
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate); /* calls the animate function over and over 
    giving the illusion of movement that we want */
}