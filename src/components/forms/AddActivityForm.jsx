import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { addActivity } from '../../services/firestoreService';

const AddActivityForm = ({ onClose, onSuccess }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        calories: '',
        duration: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        setLoading(true);
        try {
            await addActivity(currentUser.uid, {
                name: formData.name,
                calories: Number(formData.calories),
                duration: Number(formData.duration) || 0
            });

            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (error) {
            console.error("Error adding activity:", error);
            alert("Failed to add activity");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Activity Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Running, Cycling"
                required
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                    label="Calories (kcal)"
                    name="calories"
                    type="number"
                    value={formData.calories}
                    onChange={handleChange}
                    placeholder="0"
                    required
                />
                <Input
                    label="Duration (min)"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="0"
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <Button type="button" variant="secondary" onClick={onClose} fullWidth>
                    Cancel
                </Button>
                <Button type="submit" variant="accent" disabled={loading} fullWidth>
                    Add Activity
                </Button>
            </div>
        </form>
    );
};

export default AddActivityForm;
