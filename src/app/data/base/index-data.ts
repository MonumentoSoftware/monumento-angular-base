interface IndexLinks {
  next: string;
  previous: string;
}

/**
 * Index data model
 * It represens an API response with a list of items
 */
export interface Index<T> {
  count: number;
  results: T[];
  links?: IndexLinks;
  total_pages?: number;
}
