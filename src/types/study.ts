type Parameter = {
  name: string;
  description: string;
  value: number;
};

type ParameterGroup = {
  index: string[];
} & {
  [key: string]: Parameter;
};

export type Study = {
    created: string;
    description: string;
    owner: string;
    participants: string[];
    raw_title: string;
    requested_participants: string[];
    study_information: string;
    title: string;
    private: boolean;
    invited_participants: string[];
    study_type: string;
    setup_configuration: string;
    status: Record<string, string>;
    owner_name: string;
    demo: boolean;
    personal_parameters: Record<string, ParameterGroup>;
    parameters: ParameterGroup;
    advanced_parameters: ParameterGroup;
    display_names: Record<string, string>;
  };
  