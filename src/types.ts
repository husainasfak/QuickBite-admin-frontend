export type Credentials = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  tenant: Tenant | null;
};

export type CreateUserType = {
  email: string;
  firstName: string;
  lastName: string;
  tenantId: number;
  role: string;
};

export type FieldData = {
  name: string[];
  value?: string;
};

export type CreateTenantData = {
  name: string;
  address: string;
};

export type Tenant = {
  id: number;
  name: string;
};
