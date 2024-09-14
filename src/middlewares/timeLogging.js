export const timeLogging = (req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
};
