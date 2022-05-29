class NeuralNetwork{
    constructor(neuronCounts)
    {
        //the constructor gets an array of neuron counts
        this.levels=[];
        //for each level specify i/o count
        for(let i=0;i<neuronCounts.length-1;i++)
        {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i+1]));
            //adds new level with neuroncounts from (i)th and (i+1) index
        }
    }

    //feedfoward algo
    static feedForward(givenInputs,network)
    {
        //given the inputs and the networks, get the outputs
        let outputs=Level.feedForward(
            givenInputs,network.levels[0]
        ); //calls first level to produce its outputs then loop through the
        //remaining levels
        for(let i=1;i<network.levels.length;i++)
        {
            outputs=Level.feedForward(
                outputs,network.levels[i]
            );//update outputs with feedForward result from the level[i]
        }
            //this function basically puts in the output of the previous level 
            // as the input of the incoming level, the final output dictates the 
            //direction the vehicle is to be steered
        return outputs;
    }
    //mutate a network

    static mutate(network, amount=1)//or 100% reducing it gets us a network close to
    // what we had initially
    {
        network.levels.forEach(level=> {
            for(let i=0;i<level.biases.length;i++)
            {
                level.biases[i]=lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                )
            }

            for(let i=0; i<level.weights.length;i++)
            {
                for(let j=0;j<level.weights[i];j++)
                {
                    level.weights[i][j]=lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        });
    }
}


class Level{
    constructor(inputCount, outputCount) // defines the input and output neurons layers
    {
        this.inputs=new Array(inputCount); //values we get from the vehicle sensors
        this.outputs=new Array(outputCount);
        //each output has a bias.. a value above which a neuron fires
        this.biases=new Array(outputCount);

        this.weights=[];
        for(let i=0;i<inputCount;i++)
        {
            this.weights[i]=new Array(outputCount);
            //for each output neuron, its connected to the input
        }

        Level.#randomize(this);
    }

    static #randomize(level)
    {
        //go through a series of inputs and output pair
        for(let i=0;i<level.inputs.length;i++)
        {
            for(let j=0;j<level.outputs.length;j++)
            {
                level.weights[i][j]=Math.random()*2-1;
                //generates a random number btn -1 and 1
                //random() generates a number btn 0 and 1 .. do the math
            }
        }

        for(let i=0;i<level.biases.length;i++) //biases have also to be btn -1 and 1 
        {
            level.biases[i]=Math.random()*2-1;
        }
    }

    static feedForward(givenInputs, level)
    {
        //go through the level inputs
        for(let i=0;i<level.inputs.length;i++)
        {
            level.inputs[i]=givenInputs[i];
        }

        for(let i=0;i<level.outputs.length;i++)
        {
            //loop through every output, calculating the sum of weights and biases
            let sum=0
            for(let j=0;j<level.inputs.length;j++)
            {
                sum+=level.inputs[j]*level.weights[j][i];
                //check the sum
            }

            //if sum > value of the bias of output neuron, 
            if(sum>level.biases[i])
            {
                level.outputs[i]=1; //fire neuron
            } 
            else{
                level.outputs[i]=0;
            }
        }
        return level.outputs;
    }
}