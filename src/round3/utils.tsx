export const appDebounce = (delay = 2000, fun: () => void) => {
  let timer: NodeJS.Timeout;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fun();
    }, delay);
  };
};
