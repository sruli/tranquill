const wait = (timeoutLength = 5) => (
  new Promise(resolve => setTimeout(resolve, timeoutLength))
);

export default wait;
