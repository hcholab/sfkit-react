export interface Message {
  sender: string;
  time: string;
  body: string;
}

type Parameter = {
  name: string;
  description: string;
  value: string | number;
};

type ParameterIndex = {
  index: string[];
};

export type ParameterGroup = {
  [key: string]: Parameter;
} & ParameterIndex;

export type Study = {
    created: string;
    description: string;
    owner: string;
    participants: string[];
    study_id: string;
    requested_participants: Record<string, string>;
    study_information: string;
    title: string;
    private: boolean;
    invited_participants: string[];
    study_type: string;
    status: Record<string, string>;
    owner_name: string;
    demo: boolean;
    personal_parameters: Record<string, ParameterGroup>;
    parameters: ParameterGroup;
    advanced_parameters: ParameterGroup;
    display_names: Record<string, string>;
    messages: Message[];
  };
