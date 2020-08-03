const generateRandomString = () => {
  const randomString = Math.random().toString(36).substring(2, 8);

  return randomString;
};

module.exports = generateRandomString;
