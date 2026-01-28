import React, { useState } from 'react';
import PatientRegistration from '../components/patient/PatientRegistration';
import PatientBooking from '../components/patient/PatientBooking';
import '../components/patient/Patient.css';

const PatientPage = () => {
    const [patientData, setPatientData] = useState({ isValid: false });

    const handlePatientDataChange = (data) => {
        setPatientData(data);
    };

    const handleBookingSubmit = (bookingData) => {
        // Here you would typically send validation to backend
        const fullData = {
            patient: patientData,
            booking: bookingData
        };

        console.log("Booking Confirmed:", fullData);
        alert(`예약이 완료되었습니다! 💖\n\n환자: ${patientData.patientName}\n진료: ${bookingData.dept} - ${bookingData.doctor} 교수님`);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem' }}>
            <div className="patient-container">
                <PatientRegistration onPatientDataChange={handlePatientDataChange} />
                <PatientBooking isPatientValid={patientData.isValid} onBookingSubmit={handleBookingSubmit} />
            </div>
        </div>
    );
};

export default PatientPage;
