import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../services/login.service";
import {webSocket} from "rxjs/webSocket";
import {Game} from "../../models/game";

@Component({
  selector: 'app-ttt',
  templateUrl: './ttt.component.html',
  styleUrls: ['./ttt.component.scss']
})

export class TttComponent implements OnInit {
  numbers: any;
  ws = new WebSocket('ws://localhost:8081/api/notify')
  //ws = webSocket('ws://localhost:8081/api/gaming')
  gameId: number = 0;
  waiting = false;
  isGameOn = false;
  public currentUser = this.loginService.currentUserValue

  constructor(private loginService: LoginService) {
    this.numbers = Array.from(Array(20)).map((x, i) => i );
    //window.onunload = function () {
    //  return loginService.silentLogout();
    //};
  }

  ngOnInit(): void {
    this.ws.onmessage = (message) => {
      let game:Game = JSON.parse(message.data);
      if (game.isGameOn){
        this.isGameOn = true;
        this.waiting = false;
        return
      }
      if (game.user1 === this.currentUser.username){
        this.join(game.id,game.user1)
        this.waiting = true;
      }
      if (game.user2 === this.currentUser.username){
        if (confirm(game.user1 + " asked you to play, Do you want to join?")) {
          this.join(game.id,game.user2)
          this.waiting = false;
          this.isGameOn = true;
          game.isGameOn = true;
          this.ws.send(JSON.stringify(game))
        } else {
          this.waiting = false;
        }
      }
    }
  }
  join(id: number, username: string): void {
    this.gameId = id;
    // @ts-ignore
    document.getElementById('myTable').addEventListener('click', function(){
    // @ts-ignore
    let col = window.event.target.cellIndex;
    // @ts-ignore
    let row = window.event.target.parentNode.rowIndex;
    // @ts-ignore
      let x=document.getElementById('myTable').rows[row].cells;
      x[col].innerHTML="<span style='disabled'>X</span>";
    alert('Col index is: ' + col + '\nRow index is: ' + row);
    }, false);
  }
}
