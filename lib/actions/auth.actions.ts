"use server";

import { users } from "../appwrite.config";

export const logout = async () => {
  try {
    await users.deleteSession('current');
    console.log("User logged out successfully.");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};