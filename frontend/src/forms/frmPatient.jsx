
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, MapPin, Search, Activity, CheckCircle, AlertCircle, Stethoscope, ChevronRight } from 'lucide-react';
import DaumPostcode from 'react-daum-postcode';
import './frmPatient.css';

// Mock Data
const DEPARTMENTS = [
    "내과", "외과", "정형외과", "신경외과",
    "소아청소년과", "산부인과", "안과", "이비인후과"
];

const DOCTORS = {
    "내과": ["김민수", "이영희", "박철수"],
    "외과": ["정준호", "최수진", "강동원"],
    "정형외과": ["유재석", "강호동", "신동엽"],
    "신경외과": ["송중기", "송혜교", "현빈"],
    "소아청소년과": ["아이유", "김연아", "손흥민"],
    "산부인과": ["전지현", "김태희", "이영애"],
    "안과": ["박보검", "김유정", "차은우"],
    "이비인후과": ["공유", "이동욱", "김고은"]
};

export default function FrmPatient() {
    // Patient State
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

    // Booking State
    const [selectedDept, setSelectedDept] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    // Refs
    const rrnBackRef = useRef(null);

    // RRN Validation & Calculation Logic
    const calculateRRN = (front, back) => {
        const rrn = front + back;

        if (rrn.length !== 13) {
            setRrnError("주민등록번호 13자리를 모두 입력해주세요.");
            resetCalculatedFields();
            return;
        }

        // 1. Checksum Logic (Standard Korean Algorithm)
        let sum = 0;
        const multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
        for (let i = 0; i < 12; i++) {
            sum += parseInt(rrn[i]) * multipliers[i];
        }

        const remainder = sum % 11;
        const checkDigit = (11 - remainder) % 10;

        if (checkDigit !== parseInt(rrn[12])) {
            setRrnError("유효하지 않은 주민등록번호입니다 (Checksum 불일치).");
        } else {
            setRrnError("");
        }

        // 2. Info Extraction
        const genderCode = parseInt(back[0]);
        let yearPrefix = "";
        let genderStr = "";

        switch (genderCode) {
            case 1:
            case 2:
            case 5:
            case 6:
                yearPrefix = "19";
                break;
            case 3:
            case 4:
            case 7:
            case 8:
                yearPrefix = "20";
                break;
            case 9:
            case 0:
                yearPrefix = "18"; break;
            default:
                setRrnError("유효하지 않은 성별 코드입니다.");
                resetCalculatedFields();
                return;
        }

        genderStr = (genderCode % 2 !== 0) ? "남성" : "여성";

        const year = yearPrefix + front.substring(0, 2);
        const month = front.substring(2, 4);
        const day = front.substring(4, 6);

        const dateObj = new Date(`${year}-${month}-${day}`);
        if (isNaN(dateObj.getTime()) || dateObj.getMonth() + 1 !== parseInt(month) || dateObj.getDate() !== parseInt(day)) {
            setRrnError("유효하지 않은 생년월일 날짜입니다.");
            resetCalculatedFields();
            return;
        }

        const fullDate = `${year}-${month}-${day}`;
        const today = new Date();
        let calculatedAge = today.getFullYear() - dateObj.getFullYear();
        const m = today.getMonth() - dateObj.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dateObj.getDate())) {
            calculatedAge--;
        }

        setBirthDate(fullDate);
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
        if (val.length === 6 && rrnBackRef.current) {
            rrnBackRef.current.focus();
        }
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
        } else {
            // Optional: reset error if incomplete
        }
    }, [rrnFront, rrnBack]);


    const handleCompletePostcode = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        setZonecode(data.zonecode);
        setRoadAddress(fullAddress);
        setIsPostcodeOpen(false);
        document.getElementById("detailAddr").focus();
    };

    const handleOpenPostcode = () => {
        setIsPostcodeOpen(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="frmPatient-container glass-card"
        >
            {/* Split Layout */}
            <div className="section-patient">
                <div className="frmPatient-header">
                    <h2 className="title">환자 정보 등록</h2>
                    <p className="subtitle">기본 인적사항</p>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label>환자 성명</label>
                        <div className="input-wrapper">
                            <User size={18} className="icon" />
                            <input
                                type="text"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                placeholder="이름 입력"
                                className="modern-input"
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>주민등록번호</label>
                        <div className="rrn-wrapper">
                            <input
                                type="text"
                                value={rrnFront}
                                onChange={handleRrnFrontChange}
                                placeholder="앞자리 (6)"
                                className="modern-input rrn-input"
                                maxLength={6}
                            />
                            <span className="separator">-</span>
                            <input
                                type="password"
                                value={rrnBack}
                                onChange={handleRrnBackChange}
                                placeholder="뒷자리 (7)"
                                className="modern-input rrn-input"
                                maxLength={7}
                                ref={rrnBackRef}
                            />
                        </div>
                        {rrnError && <div className="error-text"><AlertCircle size={14} /> {rrnError}</div>}
                        {!rrnError && birthDate && <div className="success-text"><CheckCircle size={14} /> 유효한 번호</div>}
                    </div>

                    {/* Auto-calc Row */}
                    <div className="form-row-3">
                        <div className="form-group">
                            <label>생년월일</label>
                            <input type="text" value={birthDate} readOnly className="modern-input readonly" placeholder="자동" />
                        </div>
                        <div className="form-group">
                            <label>성별</label>
                            <input type="text" value={gender} readOnly className="modern-input readonly" placeholder="자동" />
                        </div>
                        <div className="form-group">
                            <label>나이</label>
                            <input type="text" value={age} readOnly className="modern-input readonly" placeholder="자동" />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>주소</label>
                        <div className="address-group">
                            <input
                                type="text"
                                value={zonecode}
                                readOnly
                                placeholder="우편번호"
                                className="modern-input zonecode"
                            />
                            <button type="button" onClick={handleOpenPostcode} className="modern-btn btn-search">
                                <Search size={16} /> 찾기
                            </button>
                        </div>
                        <div className="address-row">
                            <input
                                type="text"
                                value={roadAddress}
                                readOnly
                                placeholder="기본 주소 (도로명)"
                                className="modern-input"
                            />
                        </div>
                        <div className="address-row">
                            <input
                                type="text"
                                value={detailAddress}
                                onChange={(e) => setDetailAddress(e.target.value)}
                                id="detailAddr"
                                placeholder="상세 주소를 입력하세요"
                                className="modern-input"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section: Booking */}
            <div className="section-booking">
                <div className="frmPatient-header">
                    <h2 className="title">진료 예약</h2>
                    <p className="subtitle">진료과 및 의사 선택</p>
                </div>

                <div className="booking-layout">
                    {/* Dept List */}
                    <div className="dept-list">
                        <label className="list-label">진료과</label>
                        <div className="list-container">
                            {DEPARTMENTS.map(dept => (
                                <button
                                    key={dept}
                                    className={`list-item ${selectedDept === dept ? 'active' : ''}`}
                                    onClick={() => { setSelectedDept(dept); setSelectedDoctor(null); }}
                                >
                                    <div className="row-center">
                                        <Stethoscope size={16} />
                                        <span>{dept}</span>
                                    </div>
                                    <ChevronRight size={14} className="arrow" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Doctor List */}
                    <div className="doctor-list">
                        <label className="list-label">담당 의사</label>
                        <div className="list-container">
                            {selectedDept ? (
                                DOCTORS[selectedDept].map(doctor => (
                                    <button
                                        key={doctor}
                                        className={`doctor-card ${selectedDoctor === doctor ? 'active' : ''}`}
                                        onClick={() => setSelectedDoctor(doctor)}
                                    >
                                        <div className="doc-avatar">{doctor[0]}</div>
                                        <div className="doc-info">
                                            <span className="doc-name">{doctor} 교수</span>
                                            <span className="doc-dept">{selectedDept}</span>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="empty-state">진료과를<br />선택하세요</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="booking-summary">
                    <div className="summary-row">
                        <span>선택된 진료:</span>
                        <strong>{selectedDept || '-'} / {selectedDoctor || '-'}</strong>
                    </div>
                    <button className="modern-btn btn-primary full-btn mt-4" disabled={!selectedDoctor}>예약 및 저장</button>
                </div>
            </div>

            {/* Postcode Modal */}
            {isPostcodeOpen && (
                <div className="modal-overlay" onClick={() => setIsPostcodeOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <DaumPostcode onComplete={handleCompletePostcode} />
                        <button className="close-modal" onClick={() => setIsPostcodeOpen(false)}>닫기</button>
                    </div>
                </div>
            )}

        </motion.div>
    );
}
