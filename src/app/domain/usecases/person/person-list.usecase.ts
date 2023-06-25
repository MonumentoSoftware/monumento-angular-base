import { Injectable } from '@angular/core';
import { PersonRepository } from '@app/data/repositories/person-repository.service';
import { IndexUseCase } from '@app/domain/base/index.usecase';
import { PersonQuery } from '@app/domain/models/person-query';
import { DEFAULT_QUERY } from '@app/shared/const';
import { PersonModel } from '../../models/person.model';
import { Status } from '@app/domain/models/status.model';

interface SelectOption<T> {
  display: string;
  value: T;
}

@Injectable()
export class PersonListUsecase extends IndexUseCase<PersonModel, PersonQuery> {
  readonly possibleStatus: SelectOption<Status>[] = [
    { display: 'Ativo', value: Status.ACTIVE },
    { display: 'Inativo', value: Status.DISABLED },
  ];

  constructor(repository: PersonRepository) {
    super({
      initialQuery: { ...DEFAULT_QUERY, status: null },
      decoder: PersonModel.decoder,
      repository,
    });
  }

  async changeStatus(selected: Array<Status>) {
    return await this.updateQuery({ status: selected, page: this.initialQuery.page });
  }
}
