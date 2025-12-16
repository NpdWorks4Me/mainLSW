import React from 'react';
import { useParams } from 'react-router-dom';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';

// Import known blog post components
import BlogPostWhatIsLittleSpace from '@/pages/BlogPostWhatIsLittleSpace';
import BlogPostCreateYourLittlespace from '@/pages/BlogPostCreateYourLittlespace';
import BlogPostMyLittleSecrets from '@/pages/BlogPostMyLittleSecrets';
import BlogPostAmIAnAgeRegressor from '@/pages/BlogPostAmIAnAgeRegressor';
import BlogPostBedtimeRituals from '@/pages/BlogPostBedtimeRituals';
import BlogPostSurvivingYoungAdulthood from '@/pages/BlogPostSurvivingYoungAdulthood';
import BlogPostTherapeuticAgeRegression from '@/pages/BlogPostTherapeuticAgeRegression';
import BlogPostAgeVsPetRegression from '@/pages/BlogPostAgeVsPetRegression';
import BlogPostInnerChildJournaling from '@/pages/BlogPostInnerChildJournaling';
import BlogPostAgeRegression from '@/pages/BlogPostAgeRegression';

const slugMap = {
  'what-is-littlespace-a-simple-guide-for-new-age-regressors': BlogPostWhatIsLittleSpace,
  'create-your-littlespace-diy-decor-cozy-nooks-and-sensory-faves': BlogPostCreateYourLittlespace,
  'my-little-secrets-because-adulting-is-literally-not-it': BlogPostMyLittleSecrets,
  'am-i-really-an-age-regressor': BlogPostAmIAnAgeRegressor,
  '5-littlespace-bedtime-rituals-for-the-best-sleep': BlogPostBedtimeRituals,
  '5-steps-to-surviving-young-adulthood': BlogPostSurvivingYoungAdulthood,
  'therapeutic-age-regression-honest-coping-skill': BlogPostTherapeuticAgeRegression,
  'age-regression-vs-pet-regression-whats-the-difference': BlogPostAgeVsPetRegression,
  'inner-child-journaling-prompt-kit': BlogPostInnerChildJournaling,
  'age-regression-friends': BlogPostAgeRegression,
};

export default function BlogPostPage() {
  const { pillarSlug, postSlug } = useParams();
  const PostComponent = slugMap[postSlug];

  if (!PostComponent) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <PageHelmet title="Post Not Found" description="This blog post could not be found." />
        <ContentSection title="Post Not Found">
          <p className="text-gray-300">We couldn't find that post. It may have been moved or the link is outdated.</p>
        </ContentSection>
      </main>
    );
  }

  return <PostComponent />;
}
