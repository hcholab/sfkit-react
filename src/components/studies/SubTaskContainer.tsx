import React, { useState } from "react";

interface Props {
  taskDescription: string;
  children: React.ReactNode;
}

const SubTaskContainer: React.FC<Props> = ({ children }) => {
  const [isToggled, setIsToggled] = useState(true);

  return (
    <div className="sub-task-container">
      <button className="toggle-sub-task-btn" onClick={() => setIsToggled((prev) => !prev)}>
        {isToggled ? <i className="fas fa-angle-down"></i> : <i className="fas fa-angle-up"></i>}
      </button>
      {isToggled && <div className="sub-task-content">{children}</div>}
    </div>
  );
};

export default SubTaskContainer;
