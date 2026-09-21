# React Auth — Lecture Summary

JWT-based authentication in a full-stack React + Express app. The lecture builds from the ground up: first with plain JavaScript to understand the mechanics, then inside React where state, prop drilling, conditional routing, and conditional UI all come together.

---

## Big-Picture Flow

Before diving into individual files it helps to see how everything connects:

```
┌─────────────────────────────────────────────────────────────────┐
│                          App.jsx                                │
│                                                                 │
│  const [isAuthenticated, setIsAuthenticated] = useState(...)   │
│                             │                                   │
│          ┌──────────────────┼──────────────────┐               │
│          ▼                  ▼                  ▼               │
│       Navbar          LoginComponent    SignupComponent         │
│  (isAuthenticated,   (setIsAuthenticated) (setIsAuthenticated)  │
│   setIsAuthenticated)                                           │
└─────────────────────────────────────────────────────────────────┘
```

- **State lives in `App`** — one single source of truth for whether the user is logged in.
- **Props flow down** — child components receive what they need from `App` (prop drilling).
- **Setters flow down too** — children call `setIsAuthenticated` to bubble changes back up to `App`.
- **`App` re-renders** — when `isAuthenticated` changes, the router and navbar react instantly.

---

## 1. Signup with `fetch` (no React)

**File:** [demo2.js](demo2.js)

Before touching React, we focus purely on the HTTP call so there is nothing else to distract from it. Signup is a `POST` request that sends the user's email and password as a JSON body and receives back a JWT token.

```js
const apiUrl = "http://localhost:4000/api/user/signup";

const user = {
  email: "matti@example.com",
  password: "R3g5T7#gh",
};

const register = async () => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(user),       // convert JS object → JSON string
      headers: {
        "Content-Type": "application/json", // tell the server what format the body is
      },
    });

    if (!response.ok) {
      throw new Error("Failed to add a new user");
    }

    const json = await response.json(); // parse the response body
    console.log("New user added:", json);
    // json looks like: { email: "matti@example.com", token: "eyJhbGci..." }
  } catch (error) {
    console.error("Error adding user:", error.message);
  }
};

register();
```

What is happening step by step:
1. `fetch` sends the HTTP request — `await` pauses execution until the server responds.
2. `response.ok` is `true` for any 2xx HTTP status (200, 201 …). If the server returns 400 or 500 we throw so the `catch` block handles it.
3. `response.json()` reads the response body and parses it from a JSON string into a JS object — this is also async, so we `await` it.
4. The server hashes the password, creates the user in the database, signs a JWT, and sends it back. **We now have a token.**

> **What is a JWT?** A JSON Web Token is a compact string (e.g. `eyJhbGci...`) the server generates and signs with a secret key. The client stores it and sends it with every future request to prove identity — the server can verify it without a database lookup.

---

## 2. Login with `fetch` (no React)

**File:** [demo3.js](demo3.js)

Login is structurally identical to signup — only the endpoint changes. This makes it easy to compare the two side by side.

```js
const apiUrl = "http://localhost:4000/api/user/login";

const user = {
  email: "matti@example.com",
  password: "R3g5T7#gh",
};

const login = async () => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const json = await response.json();
    console.log("Login successful:", json);
    // json looks like: { email: "matti@example.com", token: "eyJhbGci..." }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

login();
```

What the server does differently: instead of creating a new user, it looks up the existing one, uses `bcrypt` to compare the submitted password with the stored hash, and — if they match — signs and returns a fresh JWT.

**The key takeaway from demos 1 and 2**: both signup and login give us a token. The client's job is to store that token so it can be used on the next page load without making the user log in again. That is what `localStorage` is for.

---

## 3. `localStorage` — Persisting Data in the Browser

**File:** [demo1.js](demo1.js)

`localStorage` is a key-value store built into the browser. It persists across page refreshes and browser restarts. There is one important constraint: **it only stores strings**. Any JS object or array must be converted to a string first with `JSON.stringify`, then converted back with `JSON.parse` when reading.

```js
// ── Use case 1: Plain strings ────────────────────────────────────
localStorage.setItem("username", "Rami");     // store
localStorage.getItem("username");              // read  → "Rami"
localStorage.removeItem("username");           // delete one key

// ── Use case 2: Objects / Arrays (must serialize) ────────────────
const userArray = ["Rami", 25];

// Store: JS value → JSON string
localStorage.setItem("user", JSON.stringify(userArray));
// "user" now holds the string: '["Rami",25]'

// Read: JSON string → JS value
const userData = JSON.parse(localStorage.getItem("user")); // ["Rami", 25]
console.log(userData); // ["Rami", 25]

localStorage.removeItem("user"); // delete
localStorage.clear();             // wipe everything

// ── Use case 3: sessionStorage ───────────────────────────────────
// Exact same API — but data is wiped when the tab is closed
sessionStorage.setItem("username", "Rami");
sessionStorage.getItem("username");
sessionStorage.removeItem("username");
```

| | `localStorage` | `sessionStorage` |
|---|---|---|
| Persists after page refresh | ✅ | ✅ |
| Persists after closing the tab | ✅ | ❌ |
| Persists after closing the browser | ✅ | ❌ |
| Shared across tabs | ✅ | ❌ |
| Suitable for storing a JWT | ✅ (common, not the most secure) | only if you want it to expire on tab close |

**Why this matters for auth**: after a successful login/signup, we store the `{ email, token }` object in `localStorage`. The next time the app loads, we read that object to decide whether the user is already authenticated — without asking them to log in again.

---

## 4. Signup in React — `fetch` + `localStorage` + State

**File:** [frontend/src/pages/SignupComponent.jsx](frontend/src/pages/SignupComponent.jsx)

Now we bring everything together inside a React component. The component manages the form inputs as controlled state, calls the same `fetch` we saw in demo2, saves the token to `localStorage`, and then updates the app-wide auth state.

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// setIsAuthenticated is passed down from App.jsx (see §6 Prop Drilling)
const SignupComponent = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // programmatic navigation after signup

  const handleSignup = async () => {
    try {
      const response = await fetch("/api/user/signup", {  // relative URL — Vite proxies to :4000
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        // user = { email: "...", token: "eyJhbGci..." }

        // Step 1 — Persist the token so it survives a page refresh
        localStorage.setItem("user", JSON.stringify(user));

        // Step 2 — Tell App.jsx that we are now authenticated
        //          This triggers a re-render: the router redirects, the navbar updates
        setIsAuthenticated(true);

        // Step 3 — Navigate to the home page
        navigate("/");
      } else {
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </label>
      <button className="signup-button" onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default SignupComponent;
```

**The three steps after a successful response are the core pattern — memorize them:**

| Step | Code | Purpose |
|---|---|---|
| 1 | `localStorage.setItem(...)` | Persist the token — survives refreshes |
| 2 | `setIsAuthenticated(true)` | Update React state — triggers re-render |
| 3 | `navigate("/")` | Redirect the user to the protected home page |

> **Vite proxy note:** The fetch URL is `/api/user/signup` (relative, no hostname). During development Vite is configured to proxy any request starting with `/api` to `http://localhost:4000`. This eliminates CORS issues — the browser thinks the frontend and backend are the same origin.

---

## 5. Login in React — `fetch` + `localStorage` + State

**File:** [frontend/src/pages/LoginComponent.jsx](frontend/src/pages/LoginComponent.jsx)

Login follows exactly the same three-step pattern. The only difference is the endpoint (`/api/user/login`) and the component name.

```jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginComponent = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/user/login", {   // ← only this line differs from signup
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        // Step 1 — Persist token
        localStorage.setItem("user", JSON.stringify(user));
        // Step 2 — Update auth state
        setIsAuthenticated(true);
        // Step 3 — Redirect
        navigate("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
      </label>
      <button className="login-button" onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default LoginComponent;
```

Both `SignupComponent` and `LoginComponent` need to call `setIsAuthenticated(true)` when the user is authenticated. But this state variable lives in `App.jsx`. How do the child components reach it? Through **prop drilling**.

---

## 6. Prop Drilling — Passing `setIsAuthenticated` Down

**Files:** [frontend/src/App.jsx](frontend/src/App.jsx) → child components

**Prop drilling** means passing a value (or function) from a parent component down to a child through props, even if intermediate components don't need it themselves.

In our app, the `isAuthenticated` state and its setter `setIsAuthenticated` are defined in `App`. Three children need access to them:

```
App.jsx  (defines state)
  │
  ├──▶  Navbar.jsx
  │         props: isAuthenticated, setIsAuthenticated
  │         needs both: isAuthenticated to decide what to show,
  │                     setIsAuthenticated to call on logout
  │
  ├──▶  LoginComponent.jsx
  │         props: setIsAuthenticated
  │         needs setter only: calls setIsAuthenticated(true) on success
  │
  └──▶  SignupComponent.jsx
            props: setIsAuthenticated
            needs setter only: calls setIsAuthenticated(true) on success
```

In `App.jsx`, the props are passed when rendering each component inside the routes:

```jsx
// App.jsx — always rendered, receives both
<Navbar
  isAuthenticated={isAuthenticated}
  setIsAuthenticated={setIsAuthenticated}
/>

// Inside <Routes> — each form component receives the setter
<SignupComponent setIsAuthenticated={setIsAuthenticated} />
<LoginComponent  setIsAuthenticated={setIsAuthenticated} />
```

In each child component, the prop is destructured from the function's parameter:

```jsx
// Receiving the prop
const SignupComponent = ({ setIsAuthenticated }) => {
  // ...
  setIsAuthenticated(true); // called after successful signup
};
```

**Why this works:** `setIsAuthenticated` is a function reference. When the child calls it, React updates the state in `App`, which re-renders `App` and all its children with the new `isAuthenticated` value. The router and navbar immediately reflect the change — with no page reload.

---

## 7. Conditional UI in the Navbar

**File:** [frontend/src/components/Navbar.jsx](frontend/src/components/Navbar.jsx)

The navbar must show different content depending on whether the user is logged in:

- **Logged in** → show a welcome message and a "Log out" button
- **Not logged in** → show "Login" and "Signup" links

It receives both props from `App`: `isAuthenticated` to branch the UI, and `setIsAuthenticated` to update state on logout.

```jsx
import { Link } from "react-router-dom";

function Navbar({ isAuthenticated, setIsAuthenticated }) {

  const handleClick = () => {
    // Logout: two steps mirror what login/signup did in reverse
    localStorage.removeItem("user"); // 1. clear the token from storage
    setIsAuthenticated(false);        // 2. update React state → triggers re-render
  };

  return (
    <nav>
      {/* Branch 1: user IS logged in */}
      {isAuthenticated && (
        <div>
          <span>Welcome</span>
          <button onClick={handleClick}>Log out</button>
        </div>
      )}

      {/* Branch 2: user is NOT logged in */}
      {!isAuthenticated && (
        <div>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
```

**How the conditional rendering works:**
- `{isAuthenticated && <div>...</div>}` — renders the div only when `isAuthenticated` is `true`. When it is `false`, the expression short-circuits and renders nothing.
- `{!isAuthenticated && <div>...</div>}` — the opposite condition.

**Logout flow:**
1. User clicks "Log out".
2. `handleClick` removes `"user"` from `localStorage` (so the token is gone permanently).
3. `setIsAuthenticated(false)` updates state in `App`.
4. `App` re-renders → `isAuthenticated` is now `false` everywhere.
5. The navbar instantly switches to the login/signup links.
6. The router redirects the user away from the protected home page.

---

## 8. Conditional Routing in `App.jsx`

**File:** [frontend/src/App.jsx](frontend/src/App.jsx)

React Router's `<Navigate>` component performs a client-side redirect. By combining it with the `isAuthenticated` state we enforce route access rules: authenticated users cannot visit the login/signup pages, and unauthenticated users cannot visit the home page.

```jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import SignupComponent from "./pages/SignupComponent";
import LoginComponent  from "./pages/LoginComponent";
import Home   from "./pages/Home";
import Navbar from "./components/Navbar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    JSON.parse(localStorage.getItem("user")) || false
  );

  return (
    <BrowserRouter>
      {/* Navbar is outside <Routes> so it always renders */}
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <div className="pages">
        <Routes>

          {/* ── Protected route (/): only for logged-in users ───────── */}
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/signup" />}
          />
          {/*
            If authenticated  → render <Home />
            If NOT authenticated → redirect to /signup immediately
          */}

          {/* ── Guest-only route (/login): only for logged-out users ── */}
          <Route
            path="/login"
            element={
              !isAuthenticated
                ? <LoginComponent setIsAuthenticated={setIsAuthenticated} />
                : <Navigate to="/" />
            }
          />
          {/*
            If NOT authenticated → render the login form
            If authenticated     → redirect to / (already logged in)
          */}

          {/* ── Guest-only route (/signup) ────────────────────────────*/}
          <Route
            path="/signup"
            element={
              !isAuthenticated
                ? <SignupComponent setIsAuthenticated={setIsAuthenticated} />
                : <Navigate to="/" />
            }
          />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

**Route access summary:**

| Route | Authenticated user | Unauthenticated user |
|---|---|---|
| `/` | ✅ sees `<Home />` | 🔀 redirected to `/signup` |
| `/login` | 🔀 redirected to `/` | ✅ sees login form |
| `/signup` | 🔀 redirected to `/` | ✅ sees signup form |

**`<Navigate>` vs `navigate()`:**
- `<Navigate to="..." />` is a **component** — used inside JSX/`element={}` to redirect declaratively when the route renders.
- `navigate("/")` is a **function** (from `useNavigate()`) — called imperatively inside event handlers, e.g. after a fetch succeeds.

---

## 9. Initializing `isAuthenticated` from `localStorage`

**File:** [frontend/src/App.jsx](frontend/src/App.jsx)

When the app first loads (or the page is refreshed), React needs to know if the user is already authenticated. We check `localStorage` for a stored user object.

### Current approach — direct expression

```jsx
const [isAuthenticated, setIsAuthenticated] = useState(
  JSON.parse(localStorage.getItem("user")) || false
);
```

**How it works:**
- `localStorage.getItem("user")` returns the stored JSON string, or `null` if nothing is stored.
- `JSON.parse(null)` returns `null`, which is falsy.
- `null || false` → `false`, so the initial state is `false` when no user is stored.
- If a user object is stored, `JSON.parse(...)` returns a truthy object → initial state is that object (truthy), which React treats as `true` in conditionals.

**Issues with this approach:**
1. The expression `JSON.parse(localStorage.getItem("user"))` is evaluated **every time** the component function runs. React only uses the result on the very first render and ignores it after that — but the work still happens on every render.
2. It trusts any stored value. If `localStorage` holds an empty object `{}` or `{ email: "x" }` without a `token`, it is still truthy and the user would be considered authenticated incorrectly.

---

### Better approach — lazy initializer

Pass a **function** to `useState` instead of a value. React calls this function **only once** on the initial render and uses the return value as the initial state.

```jsx
const [isAuthenticated, setIsAuthenticated] = useState(() => {
  // This function runs ONCE on mount, never again
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.token ? true : false;
});
```

**Why this is better:**

| | Direct expression | Lazy initializer (function) |
|---|---|---|
| When does it run? | Every render | Only on initial mount |
| Checks for actual token? | ❌ any truthy value passes | ✅ explicitly checks `user.token` |
| Empty object `{}` treated as authenticated? | ✅ (bug) | ❌ correctly returns `false` |
| Performance | Minor overhead on every render | Runs once |

**Step by step — what the function does:**
1. `localStorage.getItem("user")` → the stored JSON string, or `null`.
2. `JSON.parse(...)` → JS object `{ email: "...", token: "eyJ..." }`, or `null`.
3. `user && user.token` → only truthy if both: `user` exists **and** `user.token` exists (a real JWT string).
4. Returns `true` (authenticated) or `false` (not authenticated) — a clean boolean, not an object.

---

## Complete Auth Flow — End to End

```
User visits the app for the first time
  │
  ├─ localStorage has no "user" key
  │    └─ isAuthenticated = false
  │         ├─ Navbar shows: Login | Signup links
  │         └─ Route "/" → redirected to "/signup"
  │
  └─ User fills out the signup form and submits
       │
       ├─ fetch POST /api/user/signup  →  server creates user, returns { email, token }
       │
       ├─ localStorage.setItem("user", JSON.stringify({ email, token }))
       │    └─ token is now persisted — survives page refresh
       │
       ├─ setIsAuthenticated(true)
       │    └─ App re-renders with isAuthenticated = true
       │         ├─ Navbar switches to: Welcome + Log out button
       │         └─ Routes: "/" now renders <Home />, "/signup" redirects to "/"
       │
       └─ navigate("/")  →  user lands on the home page

─────────────────────────────────────────────────────────────────
User refreshes the page
  │
  └─ useState lazy initializer runs
       ├─ reads localStorage → finds { email, token }
       ├─ user.token exists → returns true
       └─ isAuthenticated = true  →  user stays logged in, no re-login needed

─────────────────────────────────────────────────────────────────
User clicks "Log out"
  │
  ├─ localStorage.removeItem("user")  →  token deleted
  ├─ setIsAuthenticated(false)        →  App re-renders
  │    ├─ Navbar: back to Login | Signup links
  │    └─ Route "/" → redirected to "/signup"
  └─ If user refreshes: localStorage is empty → isAuthenticated = false 
```

