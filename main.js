const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;

//const networkCanvas=document.getElementById("networkCanvas");
//networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d"); //ctx = context
//const networkCtx = networkCanvas.getContext("2d"); //ctx = context

const road = new Road(carCanvas.width/2,carCanvas.width*0.9);

// manually position the vehicle at the center always
//const car = new Car(100,100,30,50); //pixel position, width.height

//position the vehicle at the center based on the number of the lane
//const car = new Car(road.getLaneCenter(1),100,30,50,"KEYS"); //have this vehicle 
                                        //controllable by the keys
//const car = new Car(road.getLaneCenter(1),100,30,50,"AI"); // have the vehicle 
            //controllable by its neural network

// generate cars by a function
const N=2; //have a 100 vehicles going in parallel
const cars=generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain"))
{
    for(let i=0;i<cars.length;i++)
    {
        bestCar.brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0)
        {
            NeuralNetwork.mutate(cars[i].brain,0.4);
        }
    }
    
}

//car.draw(ctx);
const traffic = [
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2), //vehilce infront of the ego
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-600,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-1000,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-400,30,50,"DUMMY",2)
];
// animate motion control

animate(); //create the animate function
function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N)
{
    const cars= [];
    for(let i=1;i<N;i++)
    {
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time)
{
    for(let i=0;i<traffic.length;i++)
    {
        //go through every vehicle and let them take note of the boarders
        traffic[i].update(road.boarders,[]);
    }

    for(let i=0;i<cars.length;i++)
    {
        cars[i].update(road.boarders,traffic);
    }
    
    //define the best car to channel most resources on
    // its the car with the minimum most value of y
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y) //creates a new array with only the y-values
        )
    );

    //let the car and network canvas have the same size as the screen
    carCanvas.height=window.innerHeight;
    //networkCanvas.height=window.innerHeight;

    carCtx.save()
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx); // have the road come before the car
    for(let i=0;i<traffic.length;i++) //draw the traffic on the road
    {
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha=0.2; //reduce color intensity while drawing
    for(let i=0;i<cars.length;i++)
    {
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha=1; //restore the vehicle color intensity b4 drawing    
    bestCar.draw(carCtx,true);//only have the vehicle 0th with sensor rays

    carCtx.restore();
    //networkCtx.lineDashOffset=-time/50
    //Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate); /* calls the animate function over and over 
    giving the illusion of movement that we want */
}