import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  // const name: string = "C1";
  // const pins: PinAssignments = {
  //   left_pins: ["p1", "p3", "p5"],
  //   right_pins: ["p2", "p4"]
  // }

  return (
    <>
      <p>Hello World</p>
    </>
  );
}
