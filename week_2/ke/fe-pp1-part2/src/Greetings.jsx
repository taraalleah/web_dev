function Greetings(props){

    switch(props.lang){
        case "de":
        return <div>Hello {props.children}</div>;

        case "fr":
        return <div>Bonjour {props.children}</div>;

        case "fi":
        return <div>Hei Arvoisa {props.children}</div>;

        case "en":
        return <div>Greetings {props.children}</div>;

        case "es":
        return <div>Hola {props.children}</div>;

    }
}

export default Greetings;