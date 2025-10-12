import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/user/actions';
import { Preloader } from '@ui';
import { getStoreLoadLogin } from '../../services/slices/user/userSlice';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const isLoginLoading = useSelector(getStoreLoadLogin);
  const { values, handleChange } = useForm({ email: '', password: '' });
  const { email, password } = values;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (email && password) {
      dispatch(loginUser({ email, password }));
    }
  };

  if (isLoginLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText=''
      values={values}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
