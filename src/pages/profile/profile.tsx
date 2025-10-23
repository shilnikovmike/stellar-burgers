import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { updateUserData } from '../../services/slices/user/actions';
import {
  getStoreLoadLogout,
  getStoreLoadUpdateUserData,
  getStoreUserData
} from '../../services/slices/user/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getStoreUserData);

  const isLogoutLoading = useSelector(getStoreLoadLogout);
  const isUpdateUserLoading = useSelector(getStoreLoadUpdateUserData);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (isFormChanged) {
      const updateData = {
        name: formValue.name,
        email: formValue.email,
        password: formValue.password
      };
      dispatch(updateUserData(updateData));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (isLogoutLoading || isUpdateUserLoading) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
