"use client";

import {
  AUTH_KEY,
  AUTH_INFO_KEY,
  PROFILE_INFO_KEY,
} from "@/constant/storage.key";
import {
  getFromLocalStorage,
  setToLocalStorageAsStringify,
} from "@/utils/local-storage";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const TOKEN_EXPIRATION_TIME = 2 * 60 * 60 * 1000; // 2 hours

export const isLoggedIn = (): boolean => {
  const authToken = getFromLocalStorage(AUTH_KEY);
  if (!authToken) return false;

  const userInfo = getTokenInfo();
  if (!userInfo) return false;

  // Check token expiration
  const isTokenExpired = userInfo.exp * 1000 < Date.now();
  if (isTokenExpired) {
    logout();
    return false;
  }

  return true;
};

export interface UserInfo {
  UserID: number;
  EmpID: number;
  CompanyID: number;
  CostCenterID: number;
  SubCostCenterID: number;
  ServiceDepartmentID: number;
  issuedAt: Date;
}

export const UserInfo = (): UserInfo | null => {
  const token = getFromLocalStorage(AUTH_KEY); // Retrieve token from local storage

  if (!token) {
    console.error("No token found!");
    return null;
  }

  try {
    // Split the token into its three parts: Header, Payload, and Signature
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    // Decode the payload (second part of the token)
    const payload = JSON.parse(atob(tokenParts[1]));

    // Extract and return the relevant details from the payload
    const {
      UserID,
      EmpID,
      CompanyID,
      CostCenterID,
      SubCostCenterID,
      ServiceDepartmentID,
      iat,
    } = payload;
    return {
      UserID,
      EmpID,
      CompanyID,
      CostCenterID,
      SubCostCenterID,
      ServiceDepartmentID,
      issuedAt: new Date(iat * 1000), // Convert `iat` from Unix timestamp to Date
    };
  } catch (error: any) {
    console.error("Error decoding token:", error.message);
    return null;
  }
};

// Decode the token and store user info in localStorage
export const getTokenInfo = (): DecodedToken | null => {
  const token = getFromLocalStorage(AUTH_KEY);
  if (token) {
    const userDecodedData: DecodedToken = jwtDecode(token.split(" ")[1]);
    setToLocalStorageAsStringify(AUTH_INFO_KEY, userDecodedData);
    return userDecodedData;
  }
  return null;
};

// Handle logout by clearing the relevant localStorage items
export const logout = (): void => {
  localStorage.removeItem(PROFILE_INFO_KEY);
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_INFO_KEY);
  window.location.href = "/login";
};
