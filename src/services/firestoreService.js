import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    serverTimestamp,
    orderBy
} from 'firebase/firestore';
import { db } from './firebase';

// Collection references
const USERS_COLLECTION = 'users';
const MEALS_COLLECTION = 'meals';
const ACTIVITIES_COLLECTION = 'activities';
const SUMMARIES_COLLECTION = 'dailySummaries';

// --- User Profile ---

export const createUserProfile = async (userId, email) => {
    try {
        const userRef = doc(db, USERS_COLLECTION, userId);
        await setDoc(userRef, {
            email,
            createdAt: serverTimestamp(),
            settings: {
                calorieGoal: 2000, // Default
                // Add other defaults as needed
            }
        });
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
    }
};

export const getUserProfile = async (userId) => {
    // Implementation depends on needs (not strictly fetching doc if we have Auth user, but maybe for extra data)
};

// --- Meals ---

export const addMeal = async (userId, mealData) => {
    try {
        const docRef = await addDoc(collection(db, MEALS_COLLECTION), {
            userId,
            ...mealData,
            createdAt: serverTimestamp(),
            date: new Date().toISOString().split('T')[0] // Store date string YYYY-MM-DD for easy querying
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding meal:", error);
        throw error;
    }
};

export const getMealsByDate = async (userId, dateStr) => {
    try {
        const q = query(
            collection(db, MEALS_COLLECTION),
            where("userId", "==", userId),
            where("date", "==", dateStr),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(userId, dateStr, "Error getting meals:", error);
        throw error;
    }
};

// --- Activities ---

export const addActivity = async (userId, activityData) => {
    try {
        const docRef = await addDoc(collection(db, ACTIVITIES_COLLECTION), {
            userId,
            ...activityData,
            createdAt: serverTimestamp(),
            date: new Date().toISOString().split('T')[0]
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding activity:", error);
        throw error;
    }
};

export const getActivitiesByDate = async (userId, dateStr) => {
    try {
        const q = query(
            collection(db, ACTIVITIES_COLLECTION),
            where("userId", "==", userId),
            where("date", "==", dateStr),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting activities:", error);
        throw error;
    }
};

// --- Summaries (Optional: Aggregated data) ---
// You might calculate this on the client or update a document on addMeal/addActivity
