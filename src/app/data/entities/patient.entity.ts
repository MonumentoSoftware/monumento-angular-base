export interface PatientEntity {
    id: number;
    name: string;
    email: string;
    document: string;
    gender: string;
    cellphone?: string;
    is_staff?: boolean;
    is_active?: boolean;
    picture?: string;
    birthday: string;
  }