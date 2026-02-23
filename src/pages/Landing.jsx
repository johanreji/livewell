import React, { useEffect } from 'react';
import Button from '../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    return (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Live Well</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                Track your calories, macros, and activity to live a healthier life.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/signup">
                    <Button size="lg">Get Started</Button>
                </Link>
                <Link to="/login">
                    <Button variant="secondary" size="lg">Log In</Button>
                </Link>
            </div>
        </div>
    );
};

export default Landing;
