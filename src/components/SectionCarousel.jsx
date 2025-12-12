import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-media-query';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const SectionCarousel = ({ children, className = '', mobileLayout = 'carousel' }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const swiperParams = isDesktop ? {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 3,
    loop: true,
    coverflowEffect: {
      rotate: 30,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    pagination: { clickable: true },
    modules: [EffectCoverflow, Pagination, Autoplay],
  } : {
    slidesPerView: 1.25,
    spaceBetween: 16,
    grabCursor: true,
    loop: false,
    modules: [],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className={`w-full mt-8 relative ${className}`}
    >
      {isDesktop ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 w-full max-w-7xl mx-auto">
          {React.Children.map(children, (child, index) => (
            <div key={index} className="pb-8 h-full">
              {child}
            </div>
          )).slice(0, 3)}
        </div>
      ) : mobileLayout === 'grid' ? (
        <div className="grid grid-cols-2 gap-3 px-2 pb-10 pt-6 w-full">
           {React.Children.map(children, (child, index) => (
              <div key={index} className="h-full">
                {child}
              </div>
           ))}
        </div>
      ) : (
        <Swiper {...swiperParams} className="w-full homepage-swiper px-4 pt-8 pb-12">
          {React.Children.map(children, (child, index) => (
            <SwiperSlide key={index} className="homepage-swiper-slide-mobile h-auto">
              <div className="h-full">
                 {child}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </motion.div>
  );
};

export default SectionCarousel;