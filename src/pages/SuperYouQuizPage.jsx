import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import SuperYouQuiz from '@/components/SuperYouQuiz';

const SuperYouQuizPage = () => {
  return (
    <>
      <PageHelmet
        title="Spirit Animal Quiz"
        description="Journey into your subconscious! Identify the dominant Spirit Animal whose unique strengths and instincts guide your path."
      />
      <SuperYouQuiz />
    </>
  );
};

export default SuperYouQuizPage;