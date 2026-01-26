VERSION 5.00
Begin VB.Form frmLogin 
   Caption         =   "시스템 로그인"
   ClientHeight    =   3105
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   4680
   LinkTopic       =   "Form1"
   ScaleHeight     =   3105
   ScaleWidth      =   4680
   StartUpPosition =   2  '화면 중앙
   Begin VB.CommandButton cmdExit 
      Caption         =   "종료(&X)"
      Height          =   495
      Left            =   2520
      TabIndex        =   5
      Top             =   2160
      Width           =   1215
   End
   Begin VB.CommandButton cmdConfirm 
      Caption         =   "확인(&O)"
      Default         =   -1  'True
      Height          =   495
      Left            =   960
      TabIndex        =   4
      Top             =   2160
      Width           =   1215
   End
   Begin VB.TextBox txtPassword 
      Height          =   375
      IMEMode         =   3  'DISABLE
      Left            =   1680
      PasswordChar    =   "*"
      TabIndex        =   3
      Top             =   1320
      Width           =   2055
   End
   Begin VB.TextBox txtID 
      Height          =   375
      Left            =   1680
      TabIndex        =   1
      Top             =   720
      Width           =   2055
   End
   Begin VB.Label Label2 
      AutoSize        =   -1  'True
      Caption         =   "패스워드:"
      Height          =   180
      Left            =   720
      TabIndex        =   2
      Top             =   1410
      Width           =   735
   End
   Begin VB.Label Label1 
      AutoSize        =   -1  'True
      Caption         =   "아 이 디:"
      Height          =   180
      Left            =   720
      TabIndex        =   0
      Top             =   810
      Width           =   675
   End
End
Attribute VB_Name = "frmLogin"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

' 확인 버튼 클릭 시
Private Sub cmdConfirm_Click()
    ' 아이디/패스워드 빈값 체크
    If Trim(txtID.Text) = "" Then
        MsgBox "아이디를 입력하세요.", vbInformation, "확인"
        txtID.SetFocus
        Exit Sub
    End If
    
    If Trim(txtPassword.Text) = "" Then
        MsgBox "패스워드를 입력하세요.", vbInformation, "확인"
        txtPassword.SetFocus
        Exit Sub
    End If
    
    ' 로그인 로직 (예시: admin / 1234)
    ' 실제로는 ADO를 통해 Oracle DB 등을 조회해야 합니다.
    If txtID.Text = "admin" And txtPassword.Text = "1234" Then
        MsgBox "로그인 성공!", vbInformation, "환영합니다"
        ' Unload Me
        ' frmMain.Show ' 메인 폼 실행
    Else
        MsgBox "아이디 또는 패스워드가 틀립니다.", vbCritical, "오류"
        txtID.SetFocus
    End If
End Sub

' 종료 버튼 클릭 시
Private Sub cmdExit_Click()
    Dim nRet As Integer
    nRet = MsgBox("프로그램을 종료하시겠습니까?", vbQuestion + vbYesNo, "종료")
    
    If nRet = vbYes Then
        End
    End If
End Sub

' 폼 로드 시 초기화
Private Sub Form_Load()
    txtID.Text = ""
    txtPassword.Text = ""
End Sub