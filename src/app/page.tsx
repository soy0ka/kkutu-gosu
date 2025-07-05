import HomeClient from "~/components/HomeClient";
import { getWordbookList } from "./actions";

export default async function Home() {
  const wordbooks = await getWordbookList();

  return <HomeClient initialWordbooks={wordbooks} />;
}
