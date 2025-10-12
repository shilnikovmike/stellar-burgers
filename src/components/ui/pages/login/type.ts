import { ChangeEvent, SyntheticEvent } from 'react';

export type LoginUIProps = {
  errorText: string | undefined;
  values: {
    email: string;
    password: string;
  };
  handleSubmit: (e: SyntheticEvent) => void;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
