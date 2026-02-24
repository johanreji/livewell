import React, { useEffect } from 'react';
import Button from '../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaMagic, FaUtensils, FaRunning, FaChartPie, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';
import './Landing.css';

const features = [
    {
        icon: <FaMagic />,
        iconClass: 'feature-card__icon--ai',
        title: 'AI Meal Analysis',
        description: 'Describe your meal in plain text and get instant nutritional breakdown powered by Google Gemini AI.'
    },
    {
        icon: <FaUtensils />,
        iconClass: 'feature-card__icon--meal',
        title: 'Meal & Calorie Tracking',
        description: 'Log meals with detailed calorie counts. Track calories consumed vs burned with net calorie insights.'
    },
    {
        icon: <FaRunning />,
        iconClass: 'feature-card__icon--activity',
        title: 'Activity Logging',
        description: 'Record workouts, exercises, and everyday activities with duration and calorie burn tracking.'
    },
    {
        icon: <FaChartPie />,
        iconClass: 'feature-card__icon--nutrients',
        title: 'Nutrient Breakdown',
        description: 'Track macros (protein, carbs, fat) and micronutrients like fiber, sodium, iron, calcium, and more.'
    },
    {
        icon: <FaCalendarAlt />,
        iconClass: 'feature-card__icon--date',
        title: 'Date-Based Tracking',
        description: 'Browse your nutrition and activity history day-by-day with an intuitive date selector.'
    },
    {
        icon: <FaShieldAlt />,
        iconClass: 'feature-card__icon--auth',
        title: 'Secure & Private',
        description: 'Your data is protected with Firebase Authentication. Only you can see your health data.'
    }
];

const techStack = [
    { name: 'React', dotClass: 'tech-pill__dot--react' },
    { name: 'Firebase', dotClass: 'tech-pill__dot--firebase' },
    { name: 'Gemini AI', dotClass: 'tech-pill__dot--gemini' },
    { name: 'Vite', dotClass: 'tech-pill__dot--vite' },
    { name: 'Vercel', dotClass: 'tech-pill__dot--vercel' },
];

const Landing = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    return (
        <div>
            {/* Hero */}
            <section className="landing-hero">
                <span className="landing-hero__badge">✨ AI-Powered Health Tracking</span>
                <h1 className="landing-hero__title">Live Well</h1>
                <p className="landing-hero__subtitle">
                    Track your nutrition, log activities, and get AI-powered meal insights — all in one beautiful dashboard.
                </p>
                <div className="landing-hero__actions">
                    <Link to="/signup">
                        <Button size="lg">Get Started Free</Button>
                    </Link>
                    <Link to="/login">
                        <Button variant="secondary" size="lg">Log In</Button>
                    </Link>
                </div>
            </section>

            {/* App Preview */}
            <section className="landing-preview">
                <h2 className="landing-preview__heading">See It In Action</h2>
                <p className="landing-preview__subheading">
                    A powerful dashboard to track every aspect of your health journey.
                </p>
                <hr className="landing-divider" />

                {/* Dashboard - full width hero */}
                <div className="preview-hero landing-fade-in">
                    <div className="preview-item__image-wrapper">
                        <img src="/screenshots/dashboard.png" alt="Dashboard Overview" className="preview-item__image" />
                    </div>
                    <h3 className="preview-item__title">📊 Daily Dashboard</h3>
                    <p className="preview-item__caption">Track calories consumed vs burned, view net balance, and get a full breakdown of 12+ micro and macro nutrients — all in one view.</p>
                </div>

                {/* Meal & Activity modals side by side */}
                <div className="landing-preview__showcase">
                    <div className="preview-item landing-fade-in">
                        <div className="preview-item__image-wrapper">
                            <img src="/screenshots/meal_log.png" alt="AI Meal Logging" className="preview-item__image" />
                        </div>
                        <h3 className="preview-item__title">🤖 AI-Powered Meal Logging</h3>
                        <p className="preview-item__caption">Describe "2 boiled eggs with some sorted veggies" and AI fills in the name, calories, protein, carbs, and fat automatically.</p>
                    </div>
                    <div className="preview-item landing-fade-in">
                        <div className="preview-item__image-wrapper">
                            <img src="/screenshots/activity_log.png" alt="Activity Logging" className="preview-item__image" />
                        </div>
                        <h3 className="preview-item__title">🏃 Activity Tracking</h3>
                        <p className="preview-item__caption">Log workouts and daily activities with calorie burn and duration. Keep your fitness journey on track.</p>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="landing-features">
                <h2 className="landing-features__heading">Everything You Need</h2>
                <p className="landing-features__subheading">
                    A complete toolkit to understand and improve your daily nutrition and fitness.
                </p>
                <hr className="landing-divider" />
                <div className="landing-features__grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card landing-fade-in">
                            <div className={`feature-card__icon ${feature.iconClass}`}>
                                {feature.icon}
                            </div>
                            <h3 className="feature-card__title">{feature.title}</h3>
                            <p className="feature-card__description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tech Stack */}
            <section className="landing-tech">
                <h3 className="landing-tech__heading">Built With</h3>
                <div className="landing-tech__pills">
                    {techStack.map((tech, index) => (
                        <span key={index} className="tech-pill">
                            <span className={`tech-pill__dot ${tech.dotClass}`}></span>
                            {tech.name}
                        </span>
                    ))}
                </div>
            </section>

            {/* Footer CTA */}
            <section className="landing-cta">
                <p className="landing-cta__text">Ready to start your journey?</p>
                <p className="landing-cta__sub">Free to use. No credit card required.</p>
                <Link to="/signup">
                    <Button size="lg">Create Your Account</Button>
                </Link>
            </section>
        </div>
    );
};

export default Landing;
