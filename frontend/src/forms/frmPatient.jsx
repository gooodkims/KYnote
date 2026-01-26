
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, MapPin, Search, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import DaumPostcode from 'react-daum-postcode';
import './frmPatient.css';

export default function FrmPatient() {
    // State
    const [patientName, setPatientName] = useState("");

    // RRN State
    const [rrnFront, setRrnFront] = useState("");
    const [rrnBack, setRrnBack] = useState("");
    const [rrnError, setRrnError] = useState("");

    // Auto-calculated State
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");

    // Address State
    const [zonecode, setZonecode] = useState("");
    const [roadAddress, setRoadAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

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
        // Note: Some new RRNs (after Oct 2020) may strict checksum validation differently, 
        // but for legacy compatibility we usually perform this check. 
        // We will make it non-blocking (just warning) or strictly blocking depending on requirement.
        // Assuming strict for now as requested.

        let sum = 0;
        // Multipliers for the first 12 digits
        const multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
        for (let i = 0; i < 12; i++) {
            sum += parseInt(rrn[i]) * multipliers[i];
        }

        // Algorithm: 11 - (sum % 11) -> result % 10
        const remainder = sum % 11;
        const checkDigit = (11 - remainder) % 10;

        if (checkDigit !== parseInt(rrn[12])) {
            setRrnError("유효하지 않은 주민등록번호입니다 (Checksum 불일치).");
            // resetCalculatedFields(); // Optional: Clear fields if invalid
            // return; // Stop if strict
        } else {
            setRrnError("");
        }

        // 2. Info Extraction
        const genderCode = parseInt(back[0]);
        let yearPrefix = "";
        let genderStr = "";

        // 1,2: 1900s Domestic / 3,4: 2000s Domestic / 5,6: 1900s Foreign / 7,8: 2000s Foreign
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
                yearPrefix = "18"; // Very rare usage
                break;
            default:
                setRrnError("유효하지 않은 성별 코드입니다.");
                resetCalculatedFields();
                return;
        }

        // Gender String: Odd is Male, Even is Female
        genderStr = (genderCode % 2 !== 0) ? "남성" : "여성";

        // Date of Birth
        const year = yearPrefix + front.substring(0, 2);
        const month = front.substring(2, 4);
        const day = front.substring(4, 6);

        // Validate Date Validity (e.g. 02/30)
        const dateObj = new Date(`${year}-${month}-${day}`);
        // Check if date is valid
        if (isNaN(dateObj.getTime()) || dateObj.getMonth() + 1 !== parseInt(month) || dateObj.getDate() !== parseInt(day)) {
            setRrnError("유효하지 않은 생년월일 날짜입니다.");
            resetCalculatedFields();
            return;
        }

        const fullDate = `${year}-${month}-${day}`;

        // Age Calculation (International Age / Man-nai)
        const today = new Date();
        let calculatedAge = today.getFullYear() - dateObj.getFullYear();

        // Check if birthday has passed this year
        const m = today.getMonth() - dateObj.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dateObj.getDate())) {
            calculatedAge--;
        }

        // Apply State
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

    // Effect for Auto-trigger
    useEffect(() => {
        if (rrnFront.length === 6 && rrnBack.length === 7) {
            calculateRRN(rrnFront, rrnBack);
        } else {
            // Optional: reset error if incomplete
            // setRrnError(""); 
        }
    }, [rrnFront, rrnBack]);


    // Address Search
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
        // Focus detail address
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
            <div className="frmPatient-header">
                <h2 className="title">환자 정보 등록</h2>
                <p className="subtitle">신규 환자의 기본 정보를 입력하세요.</p>
            </div>

            <div className="form-grid">
                {/* Row 1: Name */}
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

                {/* Row 2: RRN */}
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
                    {!rrnError && birthDate && <div className="success-text"><CheckCircle size={14} /> 유효한 주민번호입니다.</div>}
                </div>

                {/* Row 3: Auto-calculated Fields */}
                <div className="form-group">
                    <label>생년월일</label>
                    <div className="input-wrapper readonly">
                        <Calendar size={18} className="icon" />
                        <input type="text" value={birthDate} readOnly className="modern-input" placeholder="자동 입력" />
                    </div>
                </div>

                <div className="form-group">
                    <label>성별</label>
                    <input type="text" value={gender} readOnly className="modern-input readonly" placeholder="자동 입력" />
                </div>

                <div className="form-group">
                    <label>나이</label>
                    <div className="input-wrapper readonly">
                        <Activity size={18} className="icon" />
                        <input type="text" value={age} readOnly className="modern-input" placeholder="자동 입력" />
                    </div>
                </div>

                {/* Row 4: Address */}
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
                            <Search size={16} /> 주소 찾기
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

            {/* Postcode Modal */}
            {isPostcodeOpen && (
                <div className="modal-overlay" onClick={() => setIsPostcodeOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <DaumPostcode onComplete={handleCompletePostcode} />
                        <button className="close-modal" onClick={() => setIsPostcodeOpen(false)}>닫기</button>
                    </div>
                </div>
            )}

            <div className="form-actions">
                <button className="modern-btn btn-primary full-btn">저장</button>
            </div>

        </motion.div>
    );
}

