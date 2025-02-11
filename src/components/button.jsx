import React, { useState } from "react";
import { useAppContext } from "../context/context";

const AddLevelBtn = () => {
  const { addLevel } = useAppContext();

  const [breathin, setBreathin] = useState("");
  const [hold, setHold] = useState("");
  const [out, setOut] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!breathin || !hold || !out || !title) {
      alert("Fill All Fields in Form");
      return;
    }

    addLevel(title, parseInt(breathin), parseInt(hold), parseInt(out));

    setBreathin("");
    setHold("");
    setOut("");
    setTitle("");
  };

  return (
    <div className="form-div">
      <form onSubmit={handleSubmit}>
        <div className="form-input">
          <label>Level Name:</label>
          <input
            type="text"
            maxLength={12}
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Name of Your Level"
          />

          <label>Breath In Time (in seconds):</label>
          <input
            min={1}
            type="number"
            required
            value={breathin}
            onChange={(e) => setBreathin(e.target.value)}
            placeholder="Enter Breath In Time in sec"
          />

          <label>Breath Hold Time (in seconds):</label>
          <input
            min={0}
            type="number"
            required
            value={hold}
            onChange={(e) => setHold(e.target.value)}
            placeholder="Enter Breath Hold Time in sec"
          />

          <label>Breath Out Time (in seconds):</label>
          <input
            type="number"
            min={1}
            required
            value={out}
            onChange={(e) => setOut(e.target.value)}
            placeholder="Enter Breath Out Time in sec"
          />

          <button type="submit">Add Level</button>
        </div>
      </form>
    </div>
  );
};

export default AddLevelBtn;
