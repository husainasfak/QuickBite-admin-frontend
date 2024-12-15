import { CreateTenantData, CreateUserType, Credentials } from "../types";
import api from "./client";

// Auth Service
export const login = (credentials: Credentials) =>
  api.post("/auth/login", credentials);

export const self = () => api.get("/auth/self");

export const logout = () => api.post("/auth/logout");

export const getUsers = (queryParams: string) =>
  api.get(`/user?${queryParams}`);
export const createUser = (userData: CreateUserType) =>
  api.post(`/user`, userData);

export const getTenants = () => api.get(`/tenant`);
export const createTenant = (tenant: CreateTenantData) =>
  api.post(`/tenant`, tenant);
