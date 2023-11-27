import React, { useState } from "react";
import angle_down from "../../static/images/angle-down-solid.svg";
import angle_up from "../../static/images/angle-up-solid.svg";

interface Props {
  taskDescription: string;
  children: React.ReactNode;
}

const SubTaskContainer: React.FC<Props> = ({ children }) => {
  const [isToggled, setIsToggled] = useState(true);

  return (
    <div className="sub-task-container">
      <button className="toggle-sub-task-btn" onClick={() => setIsToggled((prev) => !prev)}>
        {isToggled ? (
          <img src={angle_down} className="me-1 mb-1" width="20" height="20" alt="angle_down" />
        ) : (
          <img src={angle_up} className="me-1 mb-1" width="20" height="20" alt="angle_up" />
        )}
      </button>
      {isToggled && <div className="sub-task-content">{children}</div>}
    </div>
  );
};

export default SubTaskContainer;
