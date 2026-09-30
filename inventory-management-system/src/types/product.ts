export interface Product {
  id?: number
  name: string
  code: string
  price: number
  stock: number
  category: string
  createdAt?: string
}

export interface ProductFilters {
  search: string
  category: string
}
