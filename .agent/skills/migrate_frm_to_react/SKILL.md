---
name: Migrate VB6 Form to React
description: Guide for converting a Visual Basic 6.0 Form (.frm) into a modern React component using Vite.
---

# Migrate VB6 Form to React

This skill guides you through re-implementing a VB6 `.frm` file as a React component within a Vite project.

## 1. Project Setup (If not exists)
If you don't have a React/Vite project yet:
```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

## 2. Component Strategy
Create a folder `src/forms` or `src/components`. Each `.frm` file will be one React Component (e.g., `Form1.jsx`).

### Basic Template
```jsx
import { useState, useEffect } from 'react';
import './Form1.css'; // For converted styles

export default function Form1() {
  // 1. State for Form Properties
  const [caption, setCaption] = useState("Form1");
  
  // 2. State for Controls (Text, Caption, Value)
  const [text1, setText1] = useState("");
  
  // 3. Form Load Equivalent
  useEffect(() => {
    // Form_Load logic here
    console.log("Form1 Loaded");
  }, []);

  return (
    <div className="form-container" style={{ position: 'relative', width: '800px', height: '600px' }}>
      {/* Controls go here */}
      <input 
        type="text" 
        value={text1} 
        onChange={(e) => setText1(e.target.value)}
        style={{ position: 'absolute', left: '100px', top: '200px' }} 
      />
    </div>
  );
}
```

## 3. Control Mapping
Reference this table to convert VB6 Controls to HTML/React elements.

| VB6 Control | React/HTML Element | State Hook Example |
| :--- | :--- | :--- |
| `Label` | `<label>` or `<span>` | `const [lblCaption, setLblCaption] = useState("Label1")` |
| `TextBox` | `<input type="text">` | `const [txtValue, setTxtValue] = useState("")` |
| `CommandButton` | `<button>` | None (usually), handle `onClick` |
| `CheckBox` | `<input type="checkbox">` | `const [chkVal, setChkVal] = useState(false)` |
| `OptionButton` | `<input type="radio">` | Group by `name` attribute |
| `ComboBox` | `<select>` | `const [cmbIndex, setCmbIndex] = useState(0)` |
| `ListBox` | `<select multiple>` | `const [listItems, setListItems] = useState([])` |
| `PictureBox` | `<div className="pictureBox">` | Maybe `<img>` or canvas depending on usage |
| `Timer` | `useEffect` + `setInterval` | `useEffect(() => { const t = setInterval(..., interval); return () => clearInterval(t); }, [])` |

## 4. Layout & Positioning (The "Twips" Problem)
VB6 uses "Twips" (1440 twips = 1 inch).
- **Rule of Thumb**: `Pixels = Twips / 15`.
- **Absolute Positioning**: To maintain exact layout, use `position: absolute` in CSS.
    - `Left: 1500` -> `left: 100px`
    - `Top: 300` -> `top: 20px`
    - `Width: 3000` -> `width: 200px`
- **Modernization**: Prefer converting to Flexbox/Grid layouts where possible, grouping controls into semantic containers (divs) rather than strict absolute positioning.

## 5. Event Handling
| VB6 Event | React Event | Note |
| :--- | :--- | :--- |
| `_Click` | `onClick` | Buttons, Menus |
| `_Change` | `onChange` | TextBoxes (Updates on every keystroke in React) |
| `_Load` | `useEffect(() => {}, [])` | Runs once on mount |
| `_Unload` | `useEffect(() => { return () => {} }, [])` | Cleanup function |

## 6. Implementation Workflow
1. **Analyze the .frm file**: Read the header to get Control names, Types, and Positions.
2. **Scaffold the JSX**: Create the controls with `style={{ position: 'absolute', ... }}` first.
3. **Migrate Logic**:
    - Identify variables in `.bas` or top of `.frm` -> `useState`.
    - Copy logic from `Sub Command1_Click` -> `const handleCommand1Click = () => { ... }`.
4. **Refine**: Replace absolute styles with CSS classes.

---
**Note**: If the VB6 code uses heavy dependencies like `ADODB` or `Win32 API`, those logics CANNOT run in the browser. You must move that logic to a backend API.
