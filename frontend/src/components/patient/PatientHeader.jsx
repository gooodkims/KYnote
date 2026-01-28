import React from 'react';
import './Patient.css';

const PatientHeader = ({ title, subtitle }) => {
    return (
        <div className="patient-header">
            <h2 className="patient-title">{title}</h2>
            <p className="patient-subtitle">{subtitle}</p>
        </div>
    );
};

export default PatientHeader;
