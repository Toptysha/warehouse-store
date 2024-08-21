const bcrypt = require("bcrypt");
const { generateRandomString } = require("./generate-random-string");

async function checkPassAndUpdate(
  userPassword,
  userReservePass,
  reqOldPass,
  reqNewPass
) {
  let isVerify = true;
  const isMatchPassword = await bcrypt.compare(reqOldPass, userPassword);
  const isMatchReservePass = userReservePass === reqOldPass;

  if (!isMatchPassword && !isMatchReservePass) {
    isVerify = false;
  }

  let newPass = null;

  if (reqNewPass) {
    newPass = await bcrypt.hash(reqNewPass, 10);
  }

  let newReservePass = null;

  if (isMatchReservePass) {
    newReservePass = await bcrypt.hash(generateRandomString(32), 10);
  }

  return { isVerify, newPass, newReservePass };
}

module.exports = {
  checkPassAndUpdate,
};
