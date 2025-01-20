import { CreateTenantData, CreateUserType, Credentials } from "../types";
import api from "./client";

// Auth Service
const AUTH_SERVICE = "/api/auth";
const CATALOG_SERVICE = "api/catalog";

export const login = (credentials: Credentials) =>
  api.post(`${AUTH_SERVICE}/auth/login`, credentials);

export const self = () => api.get(`${AUTH_SERVICE}/auth/self`);

export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`);

export const getUsers = (queryParams: string) =>
  api.get(`${AUTH_SERVICE}/user?${queryParams}`);
export const createUser = (userData: CreateUserType) =>
  api.post(`${AUTH_SERVICE}/user`, userData);
export const updateUser = (userData: CreateUserType, id: string) =>
  api.patch(`${AUTH_SERVICE}/user/${id}`, userData);

export const getTenants = (queryParam: string) => api.get(`${AUTH_SERVICE}/tenant?${queryParam}`);
export const createTenant = (tenant: CreateTenantData) =>
  api.post(`${AUTH_SERVICE}/tenant`, tenant);

// Catelog service
export const getCategories = () => api.get(`${CATALOG_SERVICE}/categories`);
export const getProducts = (queryParam: string) =>
  api.get(`${CATALOG_SERVICE}/products?${queryParam}`);
export const createProduct = (product: FormData) =>
  api.post(`${CATALOG_SERVICE}/products`, product, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getCategory = (id: string) =>
  api.get(`${CATALOG_SERVICE}/categories/${id}`);
export const updateProduct = (product: FormData, id: string) => {
  return api.put(`${CATALOG_SERVICE}/products/${id}`, product, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
