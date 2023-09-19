import React from "react";
import StudyConfigBadge from "../../components/studies/StudyConfigBadge";
import StudyInfoModal from "../../components/studies/StudyInfoModal";
import StudyParametersModal from "../../components/studies/StudyParametersModal";
import { Study } from "../../types/study";

interface StudyHeaderProps {
  ownerName: string;
  created: string;
  rawTitle: string;
  setupConfiguration: string;
  studyType: string;
  description: string;
  study: Study;
  userId: string;
  idToken: string;
}

const StudyHeader: React.FC<StudyHeaderProps> = ({
  ownerName,
  created,
  rawTitle,
  setupConfiguration,
  studyType,
  description,
  study,
  userId,
  idToken,
}) => {
  return (
    <div className="mt-0 mb-3">
      <div className="mt-2">
        <small className="text-muted">
          Created by {ownerName} on {created}
        </small>
      </div>
      <h3 className="h3 mb-0">{rawTitle}</h3>
      <StudyConfigBadge setupConfiguration={setupConfiguration} studyType={studyType} />
      <div className="my-3">{description}</div>
      <StudyInfoModal study={study} userId={userId} idToken={idToken} />
      <StudyParametersModal study={study} userId={userId} idToken={idToken} />
    </div>
  );
};

export default StudyHeader;
