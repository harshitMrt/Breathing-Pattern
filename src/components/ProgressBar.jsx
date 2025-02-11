import { useAppContext } from "../context/context";
import Progress from "./timer";

export default function ProgressBar({ index }) {
  const { levels } = useAppContext();

  if (!levels[index]) {
    return <p>Select Level</p>;
  }

  const { inn, hold, out } = levels[index];

  return (
    <>
      <div className="progress-detail">
        <h3>Breathing Level Details</h3>
        <div>
          <p>| Inhale: {inn} s |</p>
          <p>| Hold: {hold} s |</p>
          <p>| Exhale: {out} s |</p>
        </div>
      </div>
      <div>
        <Progress index={index} />
      </div>
    </>
  );
}
