"use client";
import Hero from "@/components/Hero";
import { BestSellers, CategorySelector, Collections, Gallery, NewArrivals, Newsletter, Promos, Reviews, Trending } from "@/components/HomeSections";
import { useStore } from "@/lib/store";
import type { ReactNode } from "react";

const MAP: Record<string, ReactNode> = {
  categories: <CategorySelector />,
  newArrivals: <NewArrivals />,
  bestSellers: <BestSellers />,
  promos: <Promos />,
  trending: <Trending />,
  collections: <Collections />,
  reviews: <Reviews />,
  gallery: <Gallery />,
  newsletter: <Newsletter />,
};

export default function Home() {
  const { state } = useStore();
  return (
    <>
      <Hero />
      {state.sections.filter((s) => s.visible).map((s) => <div key={s.id}>{MAP[s.id]}</div>)}
    </>
  );
}
