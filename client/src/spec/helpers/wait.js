const wait = (timeoutLength = 1) => (
  new Promise(resolve => setTimeout(resolve, timeoutLength))
);

export default wait;
