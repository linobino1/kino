function isBrowser() {
  return typeof window !== "undefined";
}

function environment(): AppEnvironment {
  return isBrowser() ? window.ENV : process.env;
}

export default environment;
