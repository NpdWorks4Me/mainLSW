"use client";
import React, { createContext, useContext, useState, useMemo } from 'react';

    const AuthModalContext = createContext(undefined);

    export const AuthModalProvider = ({ children }) => {
        const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
        const [authModalView, setAuthModalView] = useState('login');

        const openAuthModal = (view = 'login') => {
            setAuthModalView(view);
            setIsAuthModalOpen(true);
        };

        const closeAuthModal = () => {
            setIsAuthModalOpen(false);
        };

        const switchToLogin = () => setAuthModalView('login');
        const switchToSignup = () => setAuthModalView('signup');

        const value = useMemo(() => ({
            isAuthModalOpen,
            authModalView,
            openAuthModal,
            closeAuthModal,
            switchToLogin,
            switchToSignup
        }), [isAuthModalOpen, authModalView]);

        return (
            <AuthModalContext.Provider value={value}>
                {children}
            </AuthModalContext.Provider>
        );
    };

    export const useAuthModal = () => {
        const context = useContext(AuthModalContext);
        if (context === undefined) {
            throw new Error('useAuthModal must be used within an AuthModalProvider');
        }
        return context;
    };