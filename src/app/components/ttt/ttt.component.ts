import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-ttt',
  templateUrl: './ttt.component.html',
  styleUrls: ['./ttt.component.scss']
})

export class TttComponent implements OnInit {
  numbers: any;

  constructor() {
    this.numbers = Array.from(Array(20)).map((x, i) => i );

  }

  ngOnInit(): void {
    // @ts-ignore
    document.getElementById('myTable').addEventListener('click', function(){
      // @ts-ignore
      var col = window.event.target.cellIndex;
      // @ts-ignore
      var row = window.event.target.parentNode.rowIndex;
      alert('Col index is: ' + col + '\nRow index is: ' + row);

    }, false);
  }
}
