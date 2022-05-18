// An interpolation function

function lerp(A,B,t)
{
    return A+(B-A)*t;
}

function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}

function polysIntersect(poly1, poly2)
{
    for(let i=0;i<poly1.length;i++) //loop through all the points in poly1
        // and for each of them, check the points in poly2
    {
        for(let j=0;j<poly2.length;j++)
        {
            //see if they touch or don't
            const touch=getIntersection(
                //take a point in the first polygon and its next, these form a segment
                poly1[i],
                poly1[(i+1)%poly1.length], //modulus operator eliminates a zero caused 
                //error -> this allows last point of the poly connect to first point
                // of the polygon 
                poly2[j],
                poly2[(j+1)%poly2.length]
            ); //takes segment of poly1 and compares to segments of poly2
            //if there is a touch
            if(touch)
            {
                return true;
            }
        }return false; //if there is no touch or intersection
    }   
}