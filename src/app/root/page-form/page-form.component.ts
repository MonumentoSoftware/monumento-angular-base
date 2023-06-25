import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormUseCase } from 'src/app/domain/base/form.usecase';
import { BaseModel } from 'src/app/domain/models/model';

@Component({
  selector: 'app-page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss'],
})
export class PageFormComponent {
  @Input() form!: FormUseCase<BaseModel>;
  @Input() title = 'Novo';
  @Input() pageHeaderRight!: TemplateRef<any>;
  @Output() formSubmit = new EventEmitter();
  @Output() formCancel = new EventEmitter();
}
