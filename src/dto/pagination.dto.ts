export interface PaginationDTO<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
}
