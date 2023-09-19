import React from "react";
import check from "../../static/images/check.svg";

interface Props {
  task: string;
  showCheck: boolean;
  isSubTask?: boolean;
}

const TaskElement: React.FC<Props> = ({ task, showCheck, isSubTask }) => {
  return (
    <div className={isSubTask ? "ms-5" : undefined}>
      {showCheck ? (
        <img src={check} alt="check" />
      ) : (
        <div className="spinner-grow ms-2 me-2" style={{ width: "16px", height: "16px" }}></div>
      )}
      {task}
    </div>
  );
};

export default TaskElement;
