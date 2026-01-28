import React, { useState } from 'react';
import { Stethoscope, Calendar } from 'lucide-react';
import PatientHeader from './PatientHeader';
import './Patient.css';

// Mock Data
const DEPARTMENTS = [
    "소화기내과", "심장내과", "호흡기내과", "내분비내과", "신장내과", "혈액종양내과",
    "류마티스내과", "감염내과", "소아청소년과", "신경과", "정신건강의학과", "피부과",
    "외과", "유방·갑상선클리닉", "심장혈관흉부외과", "신경외과", "정형외과", "성형외과",
    "산부인과", "안과", "이비인후과", "비뇨의학과", "재활의학과", "마취통증의학과",
    "통증클리닉", "영상의학과", "방사선종양학과", "진단검사의학과", "병리과", "핵의학과"
];

const DOCTORS = {
    "소화기내과": ["김영석", "이태희", "강상범"],
    "심장내과": ["배장호", "권택근", "김기홍"],
    "호흡기내과": ["손지웅", "나주옥", "정영훈"],
    "내분비내과": ["임동미", "김종대", "박근용"],
    "신장내과": ["황원민", "윤성로", "이윤경"],
    "혈액종양내과": ["최종권", "윤휘중", "조석구"],
    "류마티스내과": ["정강재", "김현정", "이수현"],
    "감염내과": ["오혜영", "김충종", "정혜원"],
    "소아청소년과": ["오준수", "천은정", "고경옥"],
    "신경과": ["김용덕", "나수규", "장상현"],
    "정신건강의학과": ["김승태", "박진경", "임우영"],
    "피부과": ["정한진", "이은미", "조재위"],
    "외과": ["이상억", "최인석", "김명진"],
    "유방·갑상선클리닉": ["정성후", "윤대성", "양승화"],
    "심장혈관흉부외과": ["김재현", "구관우", "조현민"],
    "신경외과": ["김기승", "이병주", "김대현"],
    "정형외과": ["김언섭", "김광균", "이석재"],
    "성형외과": ["김훈", "이용석", "임수환"],
    "산부인과": ["김철중", "이성기", "김태현"],
    "안과": ["이현구", "김만수", "고병이"],
    "이비인후과": ["김기범", "박재용", "이종구"],
    "비뇨의학과": ["김홍욱", "장영섭", "김형준"],
    "재활의학과": ["이영진", "박종태", "복수경"],
    "마취통증의학과": ["조대현", "강정규", "전영대"],
    "통증클리닉": ["조대현", "허윤석", "김동원"],
    "영상의학과": ["조영준", "김동건", "송미나"],
    "방사선종양학과": ["김정수", "박지호", "이형진"],
    "진단검사의학과": ["이종욱", "김지은", "박재현"],
    "병리과": ["김정희", "이혜경", "박수정"],
    "핵의학과": ["김동원", "송재현", "이민하"]
};

const PatientBooking = ({ isPatientValid, onBookingSubmit }) => {
    const [selectedDept, setSelectedDept] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const handleDeptChange = (e) => {
        setSelectedDept(e.target.value);
        setSelectedDoctor(null);
    };

    const handleSubmit = () => {
        if (!selectedDept || !selectedDoctor) return;
        onBookingSubmit({ dept: selectedDept, doctor: selectedDoctor });
    };

    return (
        <div className="section-patient-booking">
            <PatientHeader title="진료 예약" subtitle="진료과와 의료진을 선택하세요" />

            <div className="booking-split">
                {/* 1. 진료과 선택 (콤보박스) */}
                <div className="dept-selection">
                    <label className="form-group label">진료과</label>
                    <select
                        className="modern-select"
                        value={selectedDept}
                        onChange={handleDeptChange}
                    >
                        <option value="" disabled>진료과를 선택해주세요</option>
                        {DEPARTMENTS.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>

                {/* 2. 의사 목록 (진료과 선택 시 표시) */}
                <div className="doctor-selection">
                    <label className="form-group label">담당 의사</label>
                    <div className="doctor-grid-container" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        {selectedDept ? (
                            <div className="doctor-grid">
                                {DOCTORS[selectedDept].map(doc => (
                                    <div
                                        key={doc}
                                        className={`doc-card ${selectedDoctor === doc ? 'selected' : ''}`}
                                        onClick={() => setSelectedDoctor(doc)}
                                    >
                                        <div className="doc-avatar">{doc[0]}</div>
                                        <div className="doc-info">
                                            <span className="doc-name">{doc} 교수</span>
                                            <span className="doc-dept">{selectedDept}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-doc-state">
                                <Stethoscope size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                                <p>진료과를 먼저 선택하면<br />담당 의료진이 표시됩니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="summary-box">
                <div className="summary-details">
                    <span className="summary-label">선택된 예약 정보</span>
                    <span className="summary-value">
                        {selectedDept ? `${selectedDept} / ${selectedDoctor ? selectedDoctor + ' 교수' : '(의료진 선택 필요)'}` : '-'}
                    </span>
                </div>
                <button
                    className="primary-btn"
                    disabled={!selectedDoctor || !isPatientValid}
                    onClick={handleSubmit}
                >
                    {isPatientValid ? "예약 완료" : "환자 정보 필요"}
                </button>
            </div>
        </div>
    );
};

export default PatientBooking;
