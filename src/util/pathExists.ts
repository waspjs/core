import * as fs from "fs";

export const pathExists = async(path: string): Promise<boolean> => {
  try {
    await fs.promises.access(path);
    return true;
  } catch (err) {
    return false;
  }
};
