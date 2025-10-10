import { TWrapperProps } from './type';

export const Wrapper = ({ title, children }: TWrapperProps) => (
  <div>
    <h3>{title}</h3>
    <div>{children}</div>
  </div>
);
