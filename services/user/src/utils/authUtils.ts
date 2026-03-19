import bcrypt from "bcrypt";

export const hashPassword = async (normalPassword: string) => {
  const salt = 10;
  return await bcrypt.hash(normalPassword, salt);
};

export const comparePassword = async (
  normalPassword: string,
  encryptedPassword: string,
) => {
  return await bcrypt.compare(normalPassword, encryptedPassword);
};
