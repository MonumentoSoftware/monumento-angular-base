import { OrderOption } from "src/app/shared/const";

export interface BaseQuery {
  page: number;
  pageSize: number;
  sort: string;
  order: OrderOption;
  search: string;
}
