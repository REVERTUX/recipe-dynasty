/* eslint-disable @next/next/no-img-element */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { api } from '@/trpc/react';

function NewestRecipes() {
  const { data: recipes, isLoading } = api.recipe.getList.useQuery({ take: 5 });

  if (!recipes || isLoading) return null;

  return (
    <section className="w-full max-w-3xl">
      <Carousel
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnMouseEnter: true,
            stopOnInteraction: false,
          }),
          WheelGesturesPlugin({}),
        ]}
      >
        <CarouselContent>
          {recipes.data.map(({ id, imageUrl, title, description }) => (
            <CarouselItem key={id}>
              <Link href={`recipes/${id}`} className="relative">
                <div className="relative h-60 w-full md:h-80">
                  {imageUrl ? (
                    <Image
                      src={imageUrl ?? '/img-placeholder.png'}
                      alt={title}
                      className="rounded-md"
                      fill
                    />
                  ) : (
                    <img
                      src={'/img-placeholder.png'}
                      alt={title}
                      className="h-full w-full rounded-md"
                    />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 w-full rounded-b-sm bg-black bg-opacity-40 px-1 py-1 text-white">
                  <h4 className="text-2xl">{title}</h4>
                  <p>{description}</p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}

export default NewestRecipes;
