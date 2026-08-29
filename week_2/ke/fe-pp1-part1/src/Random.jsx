
const Random = (props) =>{

    const min = Math.ceil(props.min);
    const max = Math.floor(props.max);
    const constRandomNo = Math.floor(Math.random() * (max - min + 1) + min);

    return(
        <div className="random">
            <p>Random value between {props.min} and {props.max} =&gt; {constRandomNo}</p>
        </div>
    );
}

export default Random;
