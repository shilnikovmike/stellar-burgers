import { TWrapperProps } from './type';
import styles from './wrapper.module.css';

export const Wrapper = ({ title, children }: TWrapperProps) => (
  <div className={styles.div}>
    <h3 className={styles.h3}>{title}</h3>
    <div>{children}</div>
  </div>
);
