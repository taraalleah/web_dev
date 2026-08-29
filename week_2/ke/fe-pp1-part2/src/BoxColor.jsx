function BoxColor({ r, g, b }) {

  function toHex(color) {
    const hex = color.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
    }

function rgbToHex(r, g, b) {
    return "#" + toHex(r) + toHex(g) + toHex(b);
    }
  
  const rgbColor = `rgb(${r}, ${g}, ${b})`;
  const hexColor = rgbToHex(r,g,b);

  const boxStyle = {
    backgroundColor: rgbColor,
    color: "white",
    fontSize: "24px",
    padding: "10px",
    border: "1px solid black",
  };

//how make other one black?

return (
    <div className="box-color">
        <div style={boxStyle}>
            <p>{rgbColor}</p>
            <p>{hexColor}</p>
        </div>
    </div>
  );
}

export default BoxColor;