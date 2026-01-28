import React, { useState, useRef, useEffect } from 'react';
import { User, Search, AlertCircle, CheckCircle } from 'lucide-react';
import DaumPostcode from 'react-daum-postcode';
import PatientHeader from './PatientHeader';
import './Patient.css';

const PatientRegistration = ({ onPatientDataChange }) => {
    // Local State
    const [patientId, setPatientId] = useState("");
    const [patientName, setPatientName] = useState("");
    const [rrnFront, setRrnFront] = useState("");
    const [rrnBack, setRrnBack] = useState("");
    const [rrnError, setRrnError] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [zonecode, setZonecode] = useState("");
    const [roadAddress, setRoadAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

    const rrnBackRef = useRef(null);

    // Effect to propagate changes up
    useEffect(() => {
        onPatientDataChange({
            patientId,
            patientName,
            rrn: `${rrnFront}-${rrnBack}`,
            birthDate,
            gender,
            age,
            address: { zonecode, roadAddress, detailAddress },
            isValid: !rrnError && patientName.trim() !== "" && rrnFront.length === 6 && rrnBack.length === 7
        });
    }, [patientId, patientName, rrnFront, rrnBack, rrnError, birthDate, gender, age, zonecode, roadAddress, detailAddress]);

    // RRN Logic
    const calculateRRN = (front, back) => {
        const rrn = front + back;
        if (rrn.length !== 13) {
            setRrnError("13자리를 입력해주세요.");
            resetCalculatedFields();
            return;
        }

        // Checksum
        let sum = 0;
        const multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
        for (let i = 0; i < 12; i++) sum += parseInt(rrn[i]) * multipliers[i];
        const remainder = sum % 11;
        const checkDigit = (11 - remainder) % 10;

        if (checkDigit !== parseInt(rrn[12])) {
            setRrnError("유효하지 않은 번호입니다 (Checksum).");
        } else {
            setRrnError("");
        }

        // Info Extraction
        const genderCode = parseInt(back[0]);
        let yearPrefix = "";
        if ([1, 2, 5, 6].includes(genderCode)) yearPrefix = "19";
        else if ([3, 4, 7, 8].includes(genderCode)) yearPrefix = "20";
        else if ([9, 0].includes(genderCode)) yearPrefix = "18";
        else {
            setRrnError("성별 코드 오류.");
            return;
        }

        const genderStr = (genderCode % 2 !== 0) ? "남성" : "여성";
        const year = yearPrefix + front.substring(0, 2);
        const month = front.substring(2, 4);
        const day = front.substring(4, 6);

        const dateObj = new Date(`${year}-${month}-${day}`);
        if (isNaN(dateObj.getTime()) || dateObj.getMonth() + 1 !== parseInt(month)) {
            setRrnError("날짜 오류.");
            resetCalculatedFields();
            return;
        }

        const today = new Date();
        let calculatedAge = today.getFullYear() - dateObj.getFullYear();
        const m = today.getMonth() - dateObj.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dateObj.getDate())) {
            calculatedAge--;
        }

        setBirthDate(`${year}-${month}-${day}`);
        setGender(genderStr);
        setAge(calculatedAge);
    };

    const resetCalculatedFields = () => {
        setBirthDate("");
        setGender("");
        setAge("");
    };

    const handleRrnFrontChange = (e) => {
        const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
        setRrnFront(val);
        if (val.length === 6 && rrnBackRef.current) rrnBackRef.current.focus();
        if (val.length < 6) resetCalculatedFields();
    };

    const handleRrnBackChange = (e) => {
        const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 7);
        setRrnBack(val);
        if (val.length < 7) resetCalculatedFields();
    };

    useEffect(() => {
        if (rrnFront.length === 6 && rrnBack.length === 7) {
            calculateRRN(rrnFront, rrnBack);
        }
    }, [rrnFront, rrnBack]);

    // Postcode
    const handleCompletePostcode = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';
        if (data.addressType === 'R') {
            if (data.bname !== '') extraAddress += data.bname;
            if (data.buildingName !== '') extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
        setZonecode(data.zonecode);
        setRoadAddress(fullAddress);
        setIsPostcodeOpen(false);
    };

    return (
        <div className="section-patient-registration">
            <PatientHeader title="환자 정보 등록" subtitle="기본 인적사항을 입력해주세요" />

            <div className="form-grid">
                <div className="form-group">
                    <label>등록번호</label>
                    <input
                        type="text"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        placeholder="등록번호 입력"
                        className="modern-input"
                    />
                </div>

                <div className="form-group">
                    <label>환자 성명</label>
                    <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="이름을 입력하세요"
                        className="modern-input highlight-input"
                    />
                </div>

                <div className="form-group">
                    <label>주민등록번호</label>
                    <div className="rrn-container">
                        <input
                            type="text"
                            value={rrnFront}
                            onChange={handleRrnFrontChange}
                            placeholder="6자리"
                            className="modern-input rrn-input highlight-input"
                            maxLength={6}
                        />
                        <span className="rrn-separator">-</span>
                        <input
                            type="password"
                            value={rrnBack}
                            onChange={handleRrnBackChange}
                            placeholder="7자리"
                            className="modern-input rrn-input highlight-input"
                            maxLength={7}
                            ref={rrnBackRef}
                        />
                    </div>
                    {rrnError && <div className="error-msg"><AlertCircle size={14} /> {rrnError}</div>}
                    {!rrnError && birthDate && <div className="success-msg"><CheckCircle size={14} /> 유효한 번호입니다</div>}
                </div>

                <div className="calc-row">
                    <div className="form-group">
                        <label>생년월일</label>
                        <input type="text" value={birthDate} readOnly className="modern-input readonly-input highlight-input" placeholder="자동 계산" />
                    </div>
                    <div className="form-group">
                        <label>성별</label>
                        <input type="text" value={gender} readOnly className="modern-input readonly-input highlight-input" placeholder="자동" />
                    </div>
                    <div className="form-group">
                        <label>나이</label>
                        <input type="text" value={age} readOnly className="modern-input readonly-input highlight-input" placeholder="자동" />
                    </div>
                </div>

                <div className="form-group address-container">
                    <label>주소</label>
                    <div className="address-wrapper">
                        <div className="address-group">
                            <input type="text" value={zonecode} readOnly placeholder="우편번호" className="modern-input zonecode" />
                            <button type="button" onClick={() => setIsPostcodeOpen(true)} className="btn-search">
                                <Search size={16} /> 주소 검색
                            </button>
                        </div>
                        <input type="text" value={roadAddress} readOnly placeholder="기본 주소" className="modern-input" />
                        <input
                            type="text"
                            value={detailAddress}
                            onChange={(e) => setDetailAddress(e.target.value)}
                            placeholder="상세 주소 입력"
                            className="modern-input"
                        />
                    </div>
                </div>
            </div>

            {isPostcodeOpen && (
                <div className="postcode-modal-overlay" onClick={() => setIsPostcodeOpen(false)}>
                    <div className="postcode-modal" onClick={(e) => e.stopPropagation()}>
                        <DaumPostcode onComplete={handleCompletePostcode} />
                        <button className="close-btn" onClick={() => setIsPostcodeOpen(false)}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientRegistration;
