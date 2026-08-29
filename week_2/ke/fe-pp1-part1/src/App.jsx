import "./App.css";
import IdCard from "./IdCard.jsx"; //always import the component you want to use in your app.jsx file
import Random from "./Random.jsx";

function App() {
  return (
    <>
    <IdCard
      lastName='Doe'
      firstName='John'
      gender='male'
      height={176}
      birth={new Date("1992-07-14")}
      picture="https://randomuser.me/api/portraits/men/44.jpg"
    />

    <IdCard
      lastName='Delores '
      firstName='Obrien'
      gender='female'
      height={174}
      birth={new Date("1988-05-11")}
      picture="https://randomuser.me/api/portraits/women/44.jpg"
    />

    <IdCard
      lastName='Brown'
      firstName='Dominic'
      gender='both'
      height={300}
      birth={new Date("1788-05-14")}
      picture="https://i.pinimg.com/736x/38/fe/ef/38feeff24022e256ffd50a194b6fbbf6.jpg"
    />
    
    <>
      <Random min={1} max={6}/>
      <Random min={1} max={100}/>
    </> 

    </>
);
}

export default App;