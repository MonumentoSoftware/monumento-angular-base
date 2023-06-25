import { BaseModel } from "./model";
import { PatientEntity } from "src/app/data/entities/patient.entity";


export class PatientModel extends BaseModel<PatientEntity> {
  public readonly name!: string;
  public readonly email: string;
  public readonly document: string;
  public readonly gender: string;
  public readonly cellphone?: string;
  public readonly is_staff: boolean;
  public readonly is_active: boolean;
  public readonly picture?: string;
  public readonly birthday: string;

  constructor(entity: Partial<PatientEntity>) {
    super(entity);

    this.name = entity.name as string;
    this.email = entity.email as string;
    this.document = entity.document as string;
    this.gender = entity.gender as string;
    this.cellphone = entity.cellphone as string | undefined;
    this.is_staff = entity.is_staff as boolean;
    this.is_active = entity.is_active as boolean;
    this.picture = entity.picture as string | undefined;
    this.birthday = entity.birthday as string;
  }
}