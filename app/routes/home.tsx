import { Countries } from "~/components";
import type { Route } from "./+types/home";
import { Hero } from "~/components/hero/hero";
import RadialStats from "~/components/radial";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      {/* <Hero /> */}
      <Countries />
      {/* <RadialStats /> */}
    </>
  );
}
