export enum Status {
  ACTIVE = 'ACTIVE',
  DRAFT = 'B_DRAFT',
  DISABLED = 'DISABLED',
  UNKNOWN = 'UNKNOWN',
}

export function parseStatus(s: string): Status {
  switch (s) {
    case Status.ACTIVE:
      return Status.ACTIVE;
    case Status.DISABLED:
      return Status.DISABLED;
    case Status.DRAFT:
      return Status.DRAFT;
    default:
      return Status.UNKNOWN;
  }
}
