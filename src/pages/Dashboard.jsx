import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import DateSelector from '../components/common/DateSelector';
import Modal from '../components/common/Modal';
import AddMealForm from '../components/forms/AddMealForm';
import AddActivityForm from '../components/forms/AddActivityForm';
import { useDailyData } from '../hooks/useDailyData';
import { FaFire, FaUtensils, FaRunning } from 'react-icons/fa';

const Dashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date());
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

    const { totals, meals, activities, loading, error, refresh } = useDailyData(date);

    const { caloriesIn, caloriesOut, netCalories, nutrients } = totals || {};

    // if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading stats...</div>;
    if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-danger)' }}>Error loading data</div>;

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const handleSuccess = () => {
        refresh();
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '80px' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>Overview</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Track your daily nutrition and fitness</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <DateSelector selectedDate={date} onChange={setDate} />
                    <Button variant="ghost" size="sm" onClick={handleLogout} style={{ color: 'var(--color-danger)' }}>
                        Log Out
                    </Button>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <Button onClick={() => setIsMealModalOpen(true)} fullWidth>
                    <FaUtensils style={{ marginRight: '8px' }} /> Log Meal
                </Button>
                <Button onClick={() => setIsActivityModalOpen(true)} variant="accent" fullWidth>
                    <FaRunning style={{ marginRight: '8px' }} /> Log Activity
                </Button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-primary)' }}>
                            <FaUtensils />
                        </div>
                        <h3>Consumed</h3>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>{caloriesIn} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--color-text-muted)' }}>kcal</span></p>
                </Card>

                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.1)', color: 'var(--color-secondary)' }}>
                            <FaFire />
                        </div>
                        <h3>Burned</h3>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>{caloriesOut} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--color-text-muted)' }}>kcal</span></p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Net: {netCalories > 0 ? '+' : ''}{netCalories}</p>
                </Card>

                <Card>
                    <h3>Nutrients</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                        {/* Standard Macros First */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{nutrients?.protein || 0}g</div>
                            <small style={{ color: 'var(--color-text-muted)' }}>Protein</small>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-warning)' }}>{nutrients?.carbs || 0}g</div>
                            <small style={{ color: 'var(--color-text-muted)' }}>Carbs</small>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-danger)' }}>{nutrients?.fat || 0}g</div>
                            <small style={{ color: 'var(--color-text-muted)' }}>Fat</small>
                        </div>

                        {/* Dynamic Nutrients */}
                        {Object.entries(nutrients || {}).map(([key, value]) => {
                            if (['protein', 'carbs', 'fat'].includes(key)) return null;
                            return (
                                <div key={key} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{value}g</div>
                                    <small style={{ color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</small>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* Recent Activity / Meals Lists */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Recent Meals</h3>
                    {meals.length === 0 ? (
                        <Card className="item-card" style={{ padding: '2rem', textAlign: 'center', borderStyle: 'dashed', boxShadow: 'none' }}>
                            <p style={{ color: 'var(--color-text-muted)' }}>No meals logged today.</p>
                        </Card>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {meals.map(meal => (
                                <Card key={meal.id} className="item-card" style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{meal.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                                P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 'bold', color: 'var(--color-text-main)' }}>{meal.calories} kcal</div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Recent Activities</h3>
                    {activities.length === 0 ? (
                        <Card className="item-card" style={{ padding: '2rem', textAlign: 'center', borderStyle: 'dashed', boxShadow: 'none' }}>
                            <p style={{ color: 'var(--color-text-muted)' }}>No activities logged today.</p>
                        </Card>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {activities.map(activity => (
                                <Card key={activity.id} className="item-card" style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{activity.name}</div>
                                            {activity.duration > 0 && (
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                                    {activity.duration} mins
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ fontWeight: 'bold', color: 'var(--color-secondary)' }}>{activity.calories} kcal</div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isMealModalOpen}
                onClose={() => setIsMealModalOpen(false)}
                title="Log Meal"
            >
                <AddMealForm
                    onClose={() => setIsMealModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            </Modal>

            <Modal
                isOpen={isActivityModalOpen}
                onClose={() => setIsActivityModalOpen(false)}
                title="Log Activity"
            >
                <AddActivityForm
                    onClose={() => setIsActivityModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            </Modal>
        </div>
    );
};

export default Dashboard;
