export const appDebounce = (
  fn: (text: string) => void,
  delay: number = 2000,
) => {
  let timer: NodeJS.Timeout;
  return (text: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log('timeout');
      fn(text);
    }, delay);
  };
};
