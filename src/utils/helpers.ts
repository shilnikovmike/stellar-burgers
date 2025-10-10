export const getLastArg = (str: string, separator = '/') => {
  const strArr = str.split(`${separator}`);

  return strArr[strArr.length - 1];
};
