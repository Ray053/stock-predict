"use client";

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { cn } from "@/lib/utils";

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Swiper
        ref={ref}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
        className={cn("w-full", className)}
        {...props}
      >
        {React.Children.map(children, (child, index) => (
          <SwiperSlide key={index}>{child}</SwiperSlide>
        ))}
      </Swiper>
    );
  }
);
Carousel.displayName = "Carousel";

interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("rounded-md p-1", className)} {...props}>
        {props.children}
      </div>
    );
  }
);
CarouselItem.displayName = "CarouselItem";

interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex", className)} {...props}>
        {props.children}
      </div>
    );
  }
);
CarouselContent.displayName = "CarouselContent";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background shadow-md ring-offset-background transition-transform hover:scale-105 disabled:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    />
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background shadow-md ring-offset-background transition-transform hover:scale-105 disabled:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    />
  );
});
CarouselNext.displayName = "CarouselNext";

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
