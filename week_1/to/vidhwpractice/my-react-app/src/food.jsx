function Food() {

    const food1 = "ice cream";
    const food2 = "colder ice cream";
    
    return(
        <ul>
            <li>creamed ice</li>
            <li>{food1}</li>
            <li>{food2.toUpperCase()}</li>    
        </ul>
    );
}

export default Food