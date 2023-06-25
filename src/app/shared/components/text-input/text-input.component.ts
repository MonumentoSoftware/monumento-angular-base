import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent implements OnInit {
  @Input() placeholder: string = ' ';
  @Input() controlName: string = ' ';
  @Input() control!: FormControl;
  @Input() inputValue!: string;
  @Input() label: string = '';
  @Input() id: string = '';

  constructor() { }

  ngOnInit() { }

}
