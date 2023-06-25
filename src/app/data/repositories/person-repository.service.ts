import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonQuery } from '@app/domain/models/person-query';
import { BaseRepository } from '../base/base-repository';
import { PersonEntity } from '../entities/person-entity';
import { Task, Success } from '@app/shared/util/types/task';
import { Index } from '@app/data/base/index-data';
import { Decoder } from '@app/domain/base/decoder';
import { BaseModel } from '@app/domain/models/model';

@Injectable({
  providedIn: 'root',
})
export class PersonRepository extends BaseRepository<PersonEntity, PersonQuery> {
  indexUrl = 'admin/persons';
  showUrl = 'admin/persons/:id';
  editUrl = 'admin/persons/:id';
  deleteUrl = 'admin/persons/:id';
  createUrl = 'admin/persons';

  // INICIO DO MOCK
  private mockedList: Array<PersonEntity> = [
    { id: 1, name: 'Laíde', created_at: new Date().toISOString(), status: 'ACTIVE' },
    { id: 2, name: 'Mustafar', created_at: new Date().toISOString(), status: 'ACTIVE' },
    { id: 3, name: 'Aristostenes', created_at: new Date().toISOString(), status: 'ACTIVE' },
    { id: 4, name: 'Jurema', created_at: new Date().toISOString(), status: 'ACTIVE' },
    { id: 5, name: 'Lorelai', created_at: new Date().toISOString(), status: 'ACTIVE' },
  ];

  // FIM DO MOCK

  constructor(protected readonly http: HttpClient) {
    super();
  }

  public function;

  // TODO: REMOVER ESSAS FUNÇÕES QUANDO NÃO PRECISAR MAIS DE MOCK
  async index<T extends BaseModel>(query: Partial<PersonQuery>, decode: Decoder<T>): Promise<Task<Index<T>>> {
    const indexResponse = {
      count: this.mockedList.length,
      results: this.mockedList,
    };
    const result = new Success({ ...indexResponse, results: indexResponse?.results?.map(decode) });

    return new Promise((resolve) => {
      resolve(result);
    });
  }

  async save<T extends BaseModel>(form: PersonEntity, decode: Decoder<T>): Promise<Task<T>> {
    let item;
    if (form.id) {
      const itemIndex = this.mockedList.findIndex((value) => value.id == form.id);
      item = { ...this.mockedList[itemIndex], ...form };
      this.mockedList[itemIndex] = item;
    } else {
      item = {
        ...form,
        id: this.mockedList.length + 1,
        created_at: new Date().toISOString(),
        status: 'ACTIVE',
      };
      this.mockedList.push(item);
    }

    // SUCCESS RESPONSE
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(new Success(decode(item)));
      }, 300);
    });

    // DJANGO - NON FIELD ERROR RESPONSE
    // return new Promise((resolve) => {
    //   resolve(new Failure(new UnknownError()));
    // });

    // DJANGO - FIELD ERROR RESPONSE
    // return new Promise((resolve) => {
    //   resolve(new Failure(new NotAcceptableError('Existem campos inválidos', { name: ['Nome inválido'] })));
    // });
  }

  async delete(id: string | number): Promise<Task> {
    this.mockedList = this.mockedList.filter((item) => item.id != id);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(new Success());
      }, 300);
    });
  }

  async show<Model extends BaseModel>(id: number, decode: Decoder<Model>): Promise<Task<Model>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(new Success(decode(this.mockedList.find((item) => item.id == id))));
      }, 300);
    });
  }
}
