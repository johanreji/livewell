import { forwardRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import './DateSelector.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ExampleCustomInput = forwardRef(({ value, onClick, className }, ref) =>
    <button type="button" className={className} onClick={onClick} ref={ref} style={{ color: "white" }}>
        {value}
    </button>);

const DateSelector = ({ selectedDate, onChange }) => {

    const formatDate = (date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const d = new Date(date);
        const dateString = d.toDateString();

        if (dateString === today.toDateString()) return 'Today';
        if (dateString === yesterday.toDateString()) return 'Yesterday';

        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const changeDate = (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        onChange(newDate);
    };


    return (
        <div className="date-selector-container">
            <div className="date-navigation">
                <button className="date-nav-btn" onClick={() => changeDate(-1)}>
                    <FaChevronLeft />
                </button>
                <DatePicker
                    selected={selectedDate}
                    onChange={onChange}
                    dateFormat="MMM d, yyyy"
                    customInput={<ExampleCustomInput className="example-custom-input" />}
                />
                <button
                    className="date-nav-btn"
                    onClick={() => changeDate(1)}
                    disabled={new Date(selectedDate).toDateString() === new Date().toDateString()}
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
};

export default DateSelector;
