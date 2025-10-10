import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/user/actions';
import { Preloader } from '@ui';
import { getStoreLoadLogin } from '../../services/slices/user/userSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const isLoginLoading = useSelector(getStoreLoadLogin);

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
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
