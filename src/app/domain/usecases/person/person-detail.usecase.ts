import { Injectable } from '@angular/core';
import { PersonRepository } from '@app/data/repositories/person-repository.service';
import { DetailUsecase } from '@app/domain/base/detail.usecase';
import { PersonModel } from '../../models/person.model';

@Injectable()
export class PersonDetailUsecase extends DetailUsecase<PersonModel> {
  protected decoder = PersonModel.decoder;

  constructor(protected repository: PersonRepository) {
    super();
  }
}
