import React from 'react';
import { Form, Input, Button, Card, Typography, Modal, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

/**
 * VB6 frmLogin 현대화 컴포넌트
 * 폴더 위치: frontend/src/pages/FrmLogin.jsx
 * 변환 포인트: 
 * 1. VB6의 TextBox(txtID, txtPassword)를 antd Input으로 변환
 * 2. VB6의 MsgBox 로직을 antd message 및 Modal로 대체
 * 3. Tailwind CSS를 사용하여 중앙 정렬 및 반응형 레이아웃 적용
 */
const FrmLogin = () => {
    const [form] = Form.useForm();

    // cmdConfirm_Click 이벤트 핸들러
    const handleConfirm = async (values) => {
        const { txtID, txtPassword } = values;

        // VB6: If txtID.Text = "admin" And txtPassword.Text = "1234" Then
        // 실제 운영 환경에서는 Spring Boot API(/api/login)를 호출해야 함
        if (txtID === 'admin' && txtPassword === '1234') {
            message.success({
                content: '로그인 성공! 환영합니다.',
                duration: 2,
            });
            // TODO: 메인 화면으로 이동 로직 (e.g., navigate('/main'))
        } else {
            // VB6: MsgBox "아이디 또는 패스워드가 틀립니다.", vbCritical, "오류"
            Modal.error({
                title: '오류',
                content: '아이디 또는 패스워드가 틀립니다.',
            });
            form.setFieldsValue({ txtID: '' }); // txtID.SetFocus 대응 (필드 비우기)
        }
    };

    // cmdExit_Click 이벤트 핸들러
    const handleExit = () => {
        // VB6: nRet = MsgBox("프로그램을 종료하시겠습니까?", vbQuestion + vbYesNo, "종료")
        Modal.confirm({
            title: '종료',
            content: '프로그램을 종료하시겠습니까?',
            onOk: () => {
                window.close(); // 실제 브라우저 환경에 따라 작동 방식 다를 수 있음
            },
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <Card
                className="w-full max-w-md shadow-lg rounded-xl"
                bordered={false}
            >
                <div className="text-center mb-8">
                    <Title level={2} className="text-blue-600">시스템 로그인</Title>
                    <p className="text-gray-400 text-sm">계정 정보를 입력해 주세요.</p>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleConfirm}
                    autoComplete="off"
                    initialValues={{ txtID: '', txtPassword: '' }}
                >
                    <Form.Item
                        label="아 이 디"
                        name="txtID"
                        rules={[{ required: true, message: '아이디를 입력하세요.' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-300" />}
                            placeholder="ID"
                            size="large"
                            className="rounded-md"
                        />
                    </Form.Item>

                    <Form.Item
                        label="패스워드"
                        name="txtPassword"
                        rules={[{ required: true, message: '패스워드를 입력하세요.' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-300" />}
                            placeholder="Password"
                            size="large"
                            className="rounded-md"
                        />
                    </Form.Item>

                    <div className="flex gap-3 mt-8">
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            className="h-12 bg-blue-600 hover:bg-blue-700"
                        >
                            확인(&O)
                        </Button>
                        <Button
                            onClick={handleExit}
                            block
                            size="large"
                            className="h-12 border-gray-300"
                        >
                            종료(&X)
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default FrmLogin;
