import React from "react";
import { Badge } from "react-bootstrap";

interface StudyConfigBadgeProps {
  studyType: string;
}

const StudyConfigBadge: React.FC<StudyConfigBadgeProps> = ({ studyType }) => {
  return (
    <div>
      <Badge className="bg-secondary margin-top">{studyType} study</Badge>
    </div>
  );
};

export default StudyConfigBadge;
