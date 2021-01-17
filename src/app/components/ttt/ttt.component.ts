import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-ttt',
  templateUrl: './ttt.component.html',
  styleUrls: ['./ttt.component.scss']
})

export class TttComponent implements OnInit {
  numbers: any;

  constructor(private loginService: LoginService) {
    this.numbers = Array.from(Array(20)).map((x, i) => i );
    //window.onunload = function () {
    //  return loginService.silentLogout();
    //};
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
