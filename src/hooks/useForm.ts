import { ChangeEvent, useState } from 'react';

export const useForm = <T extends Record<string, unknown>>(
  initialValues: T
) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return { values, handleChange, setValues };
};
