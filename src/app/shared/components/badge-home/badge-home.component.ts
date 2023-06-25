import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-badge-home',
  templateUrl: './badge-home.component.html',
  styleUrls: ['./badge-home.component.scss'],
})
export class BadgeHomeComponent implements OnInit {
  @Input() title: string = ''
  @Input() image: string = ''

  constructor() { }

  ngOnInit() { }

}
