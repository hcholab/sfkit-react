import React, { useState } from "react";

interface Props {
  taskDescription: string;
  children: React.ReactNode;
}

const SubTaskContainer: React.FC<Props> = ({ children }) => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div>
      <button className={`toggle-sub-task ${isToggled ? "rotate" : ""}`} onClick={() => setIsToggled((prev) => !prev)}>
        &#9660;
      </button>
      {isToggled && <div className="sub-task-container">{children}</div>}
    </div>
  );
};

export default SubTaskContainer;
