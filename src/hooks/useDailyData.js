import { useState, useEffect, useCallback } from 'react';
import { getMealsByDate, getActivitiesByDate } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

export const useDailyData = (date) => {
    const dateStr = date?.toISOString().split('T')[0];

    const { currentUser } = useAuth();
    const [meals, setMeals] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            const [fetchedMeals, fetchedActivities] = await Promise.all([
                getMealsByDate(currentUser.uid, dateStr),
                getActivitiesByDate(currentUser.uid, dateStr)
            ]);
            setMeals(fetchedMeals);
            setActivities(fetchedActivities);
            setError(null);
        } catch (err) {
            console.error("Error fetching daily data:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [currentUser, dateStr]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Calculations
    const totalCaloriesIn = meals.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
    const totalCaloriesOut = activities.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);

    // Dynamic nutrient aggregation
    const nutrientTotals = meals.reduce((acc, meal) => {
        Object.keys(meal).forEach(key => {
            // Skip metadata and non-nutrient fields
            if (['id', 'userId', 'createdAt', 'date', 'name', 'calories'].includes(key)) return;

            // Sum up numeric values
            const val = Number(meal[key]);
            if (!isNaN(val)) {
                acc[key] = (acc[key] || 0) + val;
            }
        });
        return acc;
    }, {});

    // Ensure standard macros exist even if 0
    if (!nutrientTotals.protein) nutrientTotals.protein = 0;
    if (!nutrientTotals.carbs) nutrientTotals.carbs = 0;
    if (!nutrientTotals.fat) nutrientTotals.fat = 0;

    return {
        meals,
        activities,
        loading,
        error,
        totals: {
            caloriesIn: totalCaloriesIn,
            caloriesOut: totalCaloriesOut,
            netCalories: totalCaloriesIn - totalCaloriesOut,
            nutrients: nutrientTotals
        },
        refresh: fetchData
    };
};
