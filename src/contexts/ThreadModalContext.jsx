"use client";
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const ThreadModalContext = createContext(undefined);

export const ThreadModalProvider = ({ children }) => {
    const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);
    const [currentThreadId, setCurrentThreadId] = useState(null);

    const openThreadModal = useCallback((threadId) => {
        setCurrentThreadId(threadId);
        setIsThreadModalOpen(true);
    }, []);

    const closeThreadModal = useCallback(() => {
        setIsThreadModalOpen(false);
        setCurrentThreadId(null);
    }, []);

    const value = useMemo(() => ({
        isThreadModalOpen,
        currentThreadId,
        openThreadModal,
        closeThreadModal,
    }), [isThreadModalOpen, currentThreadId, openThreadModal, closeThreadModal]);

    return (
        <ThreadModalContext.Provider value={value}>
            {children}
        </ThreadModalContext.Provider>
    );
};

export const useThreadModal = () => {
    const context = useContext(ThreadModalContext);
    if (context === undefined) {
        throw new Error('useThreadModal must be used within a ThreadModalProvider');
    }
    return context;
};