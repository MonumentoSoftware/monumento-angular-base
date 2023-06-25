export type OrderOption = 'asc' | 'desc';
export const DEFAULT_FIRST_PAGE = 0;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_ORDER: OrderOption = 'asc';
export const DEFAULT_QUERY = {
  page: DEFAULT_FIRST_PAGE,
  pageSize: DEFAULT_PAGE_SIZE,
  order: DEFAULT_ORDER,
};
export const DEFAULT_TABLE_MESSAGES = {
  emptyMessage: 'Sem Resultados',
};
