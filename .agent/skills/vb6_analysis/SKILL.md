---
name: VB6 Code Analysis
description: A comprehensive guide and set of instructions for analyzing, understanding, and documenting Visual Basic 6.0 (VB6) source code.
---

# VB6 Code Analysis Skill

This skill empowers you to effectively analyze, document, and plan migrations for Visual Basic 6.0 (VB6) legacy projects.

## 1. Project Structure Analysis
When encountering a VB6 project, start by locating the **Project File (.vbp)**.

### Analyzing the .vbp file
- **References (`Reference=*\G...`)**: Identify external COM libraries (DLLs, OCXs). These are critical dependencies.
- **Components (`Object={...} ...`)**: Identify external ActiveX controls.
- **Modules/Classes/Forms**: List all `.bas`, `.cls`, and `.frm` files to map the project scope.
- **Startup Object (`Startup="..."`)**: Determines the entry point (`Sub Main` or a specific Form).

## 2. file Type Breakdown
- **.frm (Forms)**:
  - **Metadata Section**: The top part describes UI controls, positions (Twips), and properties.
  - **Code Section**: Starts after `Attribute VB_Name`. Contains event handlers (e.g., `Command1_Click`) and logic.
- **.bas (Modules)**:
  - Stateless functions, `Global`/`Public` variables, and API Declarations (`Declare Function`).
  - Often contains the `Sub Main` entry point.
- **.cls (Class Modules)**:
  - Object definitions with Properties (`Get`/`Let`/`Set`) and Methods.
- **.ctl (User Controls)**: Custom UI components.

## 3. Code Analysis Strategy

### A. Variable Scope & Types
- **Implicit Declaration**: Check for `Option Explicit` at the top. If missing, variables can be created on the fly (Variant type), which is a source of bugs.
- **Data Types**:
  - `Integer` = 16-bit (Short in modern languages).
  - `Long` = 32-bit (Int in modern languages).
  - `Currency` = Fixed-point decimal (often 4 decimal places).
  - `Variant` = Can hold any type, including null/empty.

### B. Control Flow & Logic
- **Events**: Logic is often event-driven (`_Click`, `_Load`, `_Change`).
- **Control Arrays**: Multiple controls sharing the same name but different `Index`. Event handlers will have an `Index` parameter (e.g., `Private Sub cmdMenu_Click(Index As Integer)`).
- **Default Instances**: VB6 allows accessing forms by their class name (e.g., `Form1.Show`). This implies a global singleton instance.

### C. Error Handling
- **Structured**: `On Error GoTo Label` ... `Resume`.
- **Ignore**: `On Error Resume Next`. Be careful; this hides failures.

### D. External Interactions
- **Win32 API**: Look for `Declare Function` or `Declare Sub` in modules. These bind to Windows DLLs (kernel32, user32) and require careful handling during migration (32-bit vs 64-bit pointers).
- **Database**:
  - **ADO**: `ADODB.Connection`, `Recordset`.
  - **DAO**: `dao.Database` (Older).
  - **RDO**: `rdoEngine` (Rare/Obsolete).

## 4. Workflows

### Workflow: Documenting Business Logic
1. Identify the trigger (Button click, Form Load).
2. Trace the call stack through `.bas` modules.
3. specific attention to Database SQL strings constructed in code.
4. Summarize the input, processing, and output.

### Workflow: Dependency Mapping
1. Read `.vbp` for all References and Objects.
2. Group by "System" (standard VB), "Third Party" (bought controls), and "Internal" (other projects).
3. Flag any missing dependencies (references that point to paths not on the current system).

## 5. Migration Risks to Flag
- **Twips**: VB6 uses screen-independent units. Conversion to Pixels is required for web/modern desktop.
- **Graphics**: `Line`, `Circle`, `PSet` methods on Forms/PictureBoxes.
- **Printer Object**: Direct printing code is hard to migrate to web.
- **GoSub ... Return**: Archaic control flow, difficult to refactor.
