import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { addMeal } from '../../services/firestoreService';
import { analyzeMeal } from '../../services/aiService';
import { FaMagic, FaPlus, FaTrash } from 'react-icons/fa';

const AddMealForm = ({ onClose, onSuccess }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [description, setDescription] = useState('');

    // Core fields
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');

    // Dynamic nutrients
    const [nutrients, setNutrients] = useState([
        { name: 'protein', value: '', unit: 'g' },
        { name: 'carbs', value: '', unit: 'g' },
        { name: 'fat', value: '', unit: 'g' }
    ]);

    const handleNutritionChange = (index, field, value) => {
        const newNutrients = [...nutrients];
        newNutrients[index][field] = value;
        setNutrients(newNutrients);
    };

    const addNutrientField = () => {
        setNutrients([...nutrients, { name: '', value: '', unit: 'g' }]);
    };

    const removeNutrientField = (index) => {
        setNutrients(nutrients.filter((_, i) => i !== index));
    };

    const handleAnalyze = async () => {
        if (!description.trim()) return;

        setAnalyzing(true);
        try {
            const result = await analyzeMeal(description);
            setName(result.name || '');
            setCalories(result.calories || '');

            const newNutrients = [];
            newNutrients.push({ name: 'protein', value: result.protein || 0, unit: 'g' });
            newNutrients.push({ name: 'carbs', value: result.carbs || 0, unit: 'g' });
            newNutrients.push({ name: 'fat', value: result.fat || 0, unit: 'g' });

            Object.keys(result).forEach(key => {
                if (['name', 'calories', 'protein', 'carbs', 'fat'].includes(key)) return;
                newNutrients.push({ name: key.replace(/_/g, ' '), value: result[key], unit: 'g' });
            });

            setNutrients(newNutrients);
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        setLoading(true);
        try {
            const nutrientsObj = nutrients.reduce((acc, curr) => {
                if (curr.name && curr.value !== '') {
                    acc[curr.name.toLowerCase().replace(/\s/g, '_')] = Number(curr.value);
                }
                return acc;
            }, {});

            await addMeal(currentUser.uid, {
                name,
                calories: Number(calories),
                ...nutrientsObj
            });

            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (error) {
            console.error("Error adding meal:", error);
            alert("Failed to add meal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* AI Analysis Section */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--color-primary)', borderRadius: 'var(--border-radius-md)', background: 'rgba(16, 185, 129, 0.05)' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
                    <FaMagic /> AI Analysis
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <Input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., 100g Chicken and Rice"
                            style={{ marginBottom: 0 }}
                        />
                    </div>
                    <Button
                        onClick={handleAnalyze}
                        disabled={analyzing || !description}
                        variant="primary"
                        size="md"
                    >
                        {analyzing ? '...' : 'Analyze'}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Input
                    label="Meal Name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Grilled Chicken Salad"
                    required
                />
                <Input
                    label="Calories (kcal)"
                    name="calories"
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="0"
                    required
                />

                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label className="input-label">Nutrients</label>
                        <Button type="button" size="sm" variant="ghost" onClick={addNutrientField}>
                            <FaPlus size={12} /> Add
                        </Button>
                    </div>

                    <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                        {nutrients.map((nutrient, index) => (
                            <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 30px', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={nutrient.name}
                                    onChange={(e) => handleNutritionChange(index, 'name', e.target.value)}
                                    placeholder="Name"
                                    style={{ textTransform: 'capitalize', marginBottom: 0 }}
                                />
                                <input
                                    type="number"
                                    className="input-field"
                                    value={nutrient.value}
                                    onChange={(e) => handleNutritionChange(index, 'value', e.target.value)}
                                    placeholder="g"
                                    style={{ marginBottom: 0 }}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeNutrientField(index)}
                                    style={{ color: 'var(--color-danger)', padding: 0, minWidth: 'auto' }}
                                >
                                    <FaTrash size={14} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <Button type="button" variant="secondary" onClick={onClose} fullWidth>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} fullWidth>
                        Add Meal
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddMealForm;
