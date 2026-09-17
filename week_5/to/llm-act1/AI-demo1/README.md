# Using LLM – Part 1

> [!NOTE]
>  This is the first in a two‑part series on using the Gemini LLM. In this part, we focus on text generation with both static and dynamic prompts, and on receiving structured responses. 

---

## TOC

- [Step 0: Prerequisites](#step-0-prerequisites)
- [Step 1: Setup Instructions](#step-1-setup-instructions)
- [Step 2: Testing the Endpoints with Postman](#step-2-testing-the-endpoints-with-postman)
- [Code Reference: textController1.js - Calling the Gemini LLM](#code-reference-textcontroller1js---calling-the-gemini-llm)
  - [Task 1](#task-1)
- [Code Reference: textController2.js - Using Dynamic Prompts](#code-reference-textcontroller2js---using-dynamic-prompts)
  - [Task 2: Create a Dynamic Health Prompt](#task-2-create-a-dynamic-health-prompt)
- [Code Reference: Model Configuration](#code-reference-model-configuration)
- [Additional Resources](#additional-resources)

---

## Step 0: Prerequisites

- **Gmail Account** – Create a personal Gmail account if you don’t already have one.
- **API Key** – Generate one at [Google AI Studio](https://aistudio.google.com/app/apikey) and store it somewhere safe.

---

## Step 1: Setup Instructions

1. **Clone or download the project**  
   - Clone the starter repo, then remove its git history
   ```bash
   git clone https://github.com/tx00-resources-en/AI-demo1
   cd AI-demo1
   ```

    Git Bash / macOS / Linux:
    ```bash
    rm -rf .git
    ```   

    Windows PowerShell:
    ```powershell
    Remove-Item -Recurse -Force .git
    ```

2. **Configure environment variables**  
   - Open `.env.example`  
   - On **line 1**, replace the dummy key  
     ```
     Jh6AIvfYH87KKL34KllmsHg
     ```  
     with the API key you generated earlier.
   - Rename the file `.env.example`  to ` .env`  

3. **Install dependencies**  
   ```bash
   npm install
   ```

4. **Start the development server**  
   ```bash
   npm run dev
   ```

---

## Step 2: Testing the Endpoints with Postman

### **Endpoint 1 – Text Generation**
- **POST** `http://localhost:4000/api/generate-text1`  
- **Body (raw JSON)**:
  ```json
  {
    "prompt": "Write 3 practical tips for staying productive while working from home."
  }
  ```
- **Expected:** Response from Gemini LLM with generated text.
- You can modify prompts in the request body to experiment with different outputs.

### **Endpoint 2 – Fitness Plan (Markdown Output)**
- **POST** `http://localhost:4000/api/generate-text2`  
- **Body (raw JSON)**:
  ```json
  {
    "fitnessType": "strength training",
    "frequency": "4",
    "experience": "beginner",
    "goal": "build muscle and increase overall strength"
  }
  ```
- **Expected:** Response in **Markdown** format.
- You can modify prompts in the request body to experiment with different outputs.

---

## Code Reference: `textController1.js` - Calling the Gemini LLM

The simplest way to call the Gemini LLM is illustrated in [`textController1.js`](./controllers/textController1.js):

1. **Import the model** (line 1):  
   ```js
   const model = require("../config/gemini");
   ```

2. **Extract prompt from request** (line 10):  
   ```js
   const { prompt } = req.body || {};
   ```

3. **Call the model** (line 16):  
   ```js
   const result = await model(prompt);
   ```

4. **Return the result** (line 17):  
   ```js
   res.json({ output: result.text });
   ```

**Notes:**
- We use `async/await` because `model()` returns a Promise — just like when we worked with Mongoose/MongoDB.
- The controller includes proper error handling and input validation.
- The prompt is extracted from the request body dynamically.


### Task 1: 

- Change the static prompt text to a **different prompt** of your choice.  
  For example:  
  ```json
  {
    "prompt": "Suggest 5 creative marketing ideas for a small coffee shop."
  }
  ```
- Send the request and **test the response** from the LLM.


---

## Code Reference: `textController2.js` - Using Dynamic Prompts

If we want to have a **dynamic prompt**, we can pass dynamic data from the client (e.g., a React frontend or Postman) and construct the prompt on the server.

This is illustrated in [`textController2.js`](./controllers/textController2.js):

- **Destructure the dynamic data** (line 12):  
  ```js
  const { fitnessType, frequency, experience, goal } = req.body;
  ```

- **Validate required fields** (lines 14-16):  
  ```js
  if (!fitnessType || !frequency || !experience || !goal) {
    return res.status(400).json({ message: "All fields are required." });
  }
  ```

- **Construct the prompt** (lines 18-22):  
  ```js
  const prompt = `
    I am a ${experience} individual looking to focus on ${fitnessType}.
    My goal is to ${goal}, and I plan to train ${frequency} times per week.
    Provide a structured fitness guideline including recommended exercises, duration, and any diet suggestions.
  `;
  ```

### Task 2: Create a Dynamic Health Prompt

**Create a new controller file `textController3.js` or modify an existing controller for this task. You'll also need to add a new route in [`routes/aiRoutes.js`](./routes/aiRoutes.js):**

1. **In your controller**, destructure the data from `req.body`:
   ```js
   const { age, gender, healthGoal, dietPreference, workoutDays } = req.body;
   ```

2. **Check for empty fields:**
   ```js
   if (!age || !gender || !healthGoal || !dietPreference || !workoutDays) {
     return res.status(400).json({ message: "All fields are required." });
   }
   ```

3. **Construct a dynamic prompt** using template literals:
   ```js
   const prompt = `
     I am a ${age}-year-old ${gender} aiming to ${healthGoal}.
     My diet preference is ${dietPreference}, and I can work out ${workoutDays} days per week.
     Please provide a personalized weekly health and fitness plan, including exercise types, duration, and meal suggestions.
   `;
   ```

4. **Pass the prompt** to your Gemini model:
   ```js
   const result = await model(prompt);
   res.json({ output: result.text });
   ```

5. **From Postman**, send a `POST` request with the following JSON body:  
   ```json
   {
     "age": 35,
     "gender": "female",
     "healthGoal": "improve cardiovascular endurance",
     "dietPreference": "vegetarian",
     "workoutDays": 4
   }
   ```

---


## Code Reference: Model Configuration

The code to configure Gemini LLM is in [`config/gemini.js`](./config/gemini.js):

- On **line 8**, you can choose from different models, e.g., `gemini-2.5-flash`, `gemini-2.0-flash`.  
  For rapid prototyping, we are **using** `gemini-2.5-flash` because it provides a good balance of speed and quality.

- On **line 16**, there is a config property named `temperature` set to `0.1`.  
  This controls randomness in the output:  
  - `0.0` → Deterministic  
  - `0.7–1.0` → More random, creative responses

- More details [here](./config/gemini.md)

### Environment Variables Configuration

1. Open [`.env.example`](./.env.example).  
   - On **line 1**, replace the placeholder with your API key:
     ```env
     GEMINI_API_KEY=your_actual_api_key_here
     ```

2. Rename the file from `.env.example` to `.env`.  
   - We do this because `.env` is listed in `.gitignore`, so your API key will not be committed to the repository.

---

## Additional Resources

- [Text Generation Docs](https://ai.google.dev/gemini-api/docs/text-generation)  
- [Document Processing Docs](https://ai.google.dev/gemini-api/docs/document-processing)  
- [Image Understanding Docs](https://ai.google.dev/gemini-api/docs/image-understanding)  
- [Audio Processing Docs](https://ai.google.dev/gemini-api/docs/audio)  
- [Structured Output Docs](https://ai.google.dev/gemini-api/docs/structured-output)  



