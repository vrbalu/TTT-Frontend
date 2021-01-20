import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../services/login.service";
import {webSocket} from "rxjs/webSocket";
import {Game} from "../../models/game";
import {Gameplay} from "../../models/gameplay";

@Component({
  selector: 'app-ttt',
  templateUrl: './ttt.component.html',
  styleUrls: ['./ttt.component.scss']
})

export class TttComponent implements OnInit {
  numbers: any;
  ws = new WebSocket('ws://localhost:8081/api/notify')
  gameWs = new WebSocket('ws://localhost:8081/api/gaming')
  gameId: number = 0;
  waiting = false;
  isGameOn = false;
  currentGamePlay: Gameplay = {}
  public currentUser = this.loginService.currentUserValue
  notCurrentlyPlaying = true;

  constructor(private loginService: LoginService) {
    this.numbers = Array.from(Array(20)).map((x, i) => i);
    //window.onunload = function () {
    //  return loginService.silentLogout();
    //};
  }

  ngOnInit(): void {
    // @ts-ignore


    this.ws.onmessage = (message) => {
      let game: Game = JSON.parse(message.data);
      if (game.isGameOn) {
        this.isGameOn = true;
        this.waiting = false;
        return
      }
      if (game.user1 === this.currentUser.username) {
        this.join(game.id, game.user1, game.user2)
        this.waiting = true;
      }
      if (game.user2 === this.currentUser.username) {
        if (confirm(game.user1 + " asked you to play, Do you want to join?")) {
          this.join(game.id, game.user1, game.user2)
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

  join(id: number, user1: string, user2: string): void {
    this.gameId = id;
    this.currentGamePlay.id = id
    this.currentGamePlay.user = user1
    this.currentGamePlay.isWinner = false
    this.currentGamePlay.y = -1;
    this.currentGamePlay.x = -1;
    this.currentGamePlay.shape = "X"
    this.play(this.currentGamePlay)
    this.gameWs.onmessage = (message) => {
      let move: Gameplay = JSON.parse(message.data);
      if (move.id === this.currentGamePlay.id) {
        // @ts-ignore
        let x = document.getElementById('myTable').rows[move.x].cells;
        x[move.y].innerHTML = "<span style='disabled'>" + move.shape + "</span>";
        if (move.user === user1) {
          this.currentGamePlay.user = user2;
          this.currentGamePlay.shape = "O";
        } else {
          this.currentGamePlay.user = user1;
          this.currentGamePlay.shape = "X"
        }
        if (!this.currentGamePlay.isWinner){
          if (move.user === this.currentUser.username){
            document.addEventListener("click",this.handler,true);
          }else {
            console.log(this.currentGamePlay)
            console.log(this.currentUser.username)
            this.play(this.currentGamePlay)
          }
        }
        }

      }

    }
  play (currentGamePlay: Gameplay): void {
      document.removeEventListener('click', this.handler)
      // @ts-ignore
      document.getElementById('myTable').addEventListener('click', () => {
        // @ts-ignore
        currentGamePlay.y = window.event.target.cellIndex;
        // @ts-ignore
        currentGamePlay.x = window.event.target.parentNode.rowIndex;
        if (currentGamePlay.y !== -1 || currentGamePlay.x !== -1) {
          this.gameWs.send(JSON.stringify(currentGamePlay))
        }
      }, false);

  }
  handler(e: { stopPropagation: () => void; preventDefault: () => void; }){
    e.stopPropagation();
    e.preventDefault();
  }
}
