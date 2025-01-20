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

export interface PriceConfiguration {
  [key: string]: {
    priceType: "base" | "aditional";
    availableOptions: string[];
  };
}

export interface Attribute {
  name: string;
  widgetType: "switch" | "radio";
  defaultValue: string;
  availableOptions: string[];
}

export interface Category {
  _id: string;
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
}

export type ProductAttribute = {
  name: string;
  value: string | boolean;
};

export type Product = {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: Category;
  priceConfiguration: PriceConfiguration;
  attributes: ProductAttribute[];
  isPublish: boolean;
  createdAt: string;
};

export type ImageField = { file: File };
export type CreateProductData = Product & { image: ImageField };
