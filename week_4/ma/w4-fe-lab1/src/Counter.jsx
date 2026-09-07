import './Counter.css';
import { useState } from 'react';

const Counter = () => {
    const [theme, setTheme] = useState('light');

    const setDarkThemeHandler = () => {
        setTheme('dark');
        //console.log('Dark clicked');
    };
    const setLightThemeHandler = () => {
        setTheme('light');
        //console.log('Light clicked');
    };

    const toggleThemeHandler = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const [count, setCount] = useState(0);

    const incrementHandler = () => {
        setCount(prevCount => prevCount + 1);
    };

    const decrementHandler = () => {
        setCount(prevCount => prevCount - 1);
    };

    return (
        <div className={`content ${theme}`}>
            <h1>UseState Component</h1>
            <button onClick={setDarkThemeHandler}>Dark</button>
            <button onClick={setLightThemeHandler}>Light</button>
            <button onClick={toggleThemeHandler}>Toggle</button>

            <h2>{count}</h2>
            <button onClick={incrementHandler}>Increment</button>
            <button onClick={decrementHandler}>Decrement</button>
        </div>
    );
};

export default Counter;