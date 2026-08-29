import visaImage from "./assets/images/visa.png";
import mastercardImage from "./assets/images/master.png";

function CreditCard(props) {

    const number = props.number;
    const lastFourDigits = number.slice(-4);
    const expirationYear = String(props.expirationYear);
    const year = expirationYear.slice(-2);
    const bg = props.bgColor;
    const font = props.color;

    const logo = (type) => {
    switch (type) {
        case "Visa":
        return visaImage;

        case "Master Card":
        return mastercardImage;
    }
    };

    return(
        <div className="credit-card" style={{ backgroundColor: bg, color: font }}>
            <img className="my-img" src={logo(props.type)} alt="Card Logo" />
            <p className = "important-no">•••• •••• •••• {lastFourDigits}</p>
            <div className= "info">
                <p>Expires {props.expirationMonth}/{year} {props.bank}</p>
                <p>{props.owner}</p>
            </div>
        </div>
    );
}

export default CreditCard;