import { Countries } from "~/components";
import type { Route } from "./+types/home";
import { Hero } from "~/components/hero/hero";
import RadialStats from "~/components/radial";
import CardAnimation from "~/components/card-animation";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <Hero />
      <CardAnimation />
      <Countries />
    </>
  );
}
