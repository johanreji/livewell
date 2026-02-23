import React from 'react';
import './Input.css';

const Input = ({
    label,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    error,
    id,
    name,
    required = false
}) => {
    return (
        <div className={`input-group ${error ? 'input-group--error' : ''}`}>
            {label && <label htmlFor={id} className="input-label">{label}</label>}
            <input
                id={id}
                name={name}
                type={type}
                className="input-field"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
            {error && <span className="input-error">{error}</span>}
        </div>
    );
};

export default Input;
