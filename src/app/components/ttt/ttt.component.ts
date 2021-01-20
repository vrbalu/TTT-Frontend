import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../services/login.service";
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
  // @ts-ignore
  currentGamePlay: Gameplay = {}
  public currentUser = this.loginService.currentUserValue
  notCurrentlyPlaying = true;
  board = Array(20).fill(null).map(() => Array(20));

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
          }else {
            console.log(this.currentGamePlay)
            console.log(this.currentUser.username)
          }
        }
        }

      }

    }
  play (currentGamePlay: Gameplay): void {
      let win = false;

        // @ts-ignore
        document.getElementById('myTable').addEventListener('click', () => {
          // @ts-ignore
          currentGamePlay.y = window.event.target.cellIndex;
          // @ts-ignore
          currentGamePlay.x = window.event.target.parentNode.rowIndex;
          if (currentGamePlay.y !== -1 || currentGamePlay.x !== -1) {
            if (currentGamePlay.user === this.currentUser.username) {
              if (currentGamePlay.shape === "X"){
                win = this.checkWin("X",[currentGamePlay.x,currentGamePlay.y])
                if (!win) {
                  this.board[currentGamePlay.x][currentGamePlay.y] = "X"
                } else{
                  this.currentGamePlay.isWinner = true
                  alert("You WON!")
                }
              }
              if (currentGamePlay.shape === "O"){
                win = this.checkWin("O",[currentGamePlay.x,currentGamePlay.y])
                if (!win){
                  this.board[currentGamePlay.x][currentGamePlay.y] = "O"
                } else{
                  alert("You WON!")
                  this.currentGamePlay.isWinner = true
                }
              }
            this.gameWs.send(JSON.stringify(currentGamePlay))
            }
          }
        }, false);
      }

  checkWin(shape:string, lastMove: any) {
    let requiredLineLength = 5;
    let lineDirections = [
      [0, 1], //horizontal
      [1, 0], //vertical
      [1, -1], //diagonal 1
      [1, 1] //diagonal 2
    ];
    let won = false;
    for (let i = 0; i < lineDirections.length && !won; i++) {
      let shift = lineDirections[i];
      let currentSquare = [lastMove[0] + shift[0], lastMove[1] + shift[1]];
      let lineLength = 1;

      while (lineLength < requiredLineLength && this.legalSquare(currentSquare) && this.board[currentSquare[0]][currentSquare[1]] === shape) {
        lineLength++;
        currentSquare[0] += shift[0];
        currentSquare[1] += shift[1];
      }

      currentSquare = [lastMove[0] - shift[0], lastMove[1] - shift[1]];
      while (lineLength < requiredLineLength && this.legalSquare(currentSquare) && this.board[currentSquare[0]][currentSquare[1]] === shape) {
        lineLength++;
        currentSquare[0] -= shift[0];
        currentSquare[1] -= shift[1];
      }
      if (lineLength >= requiredLineLength)
        won = true;
    }
    return won;
  }
  legalSquare(square:any) {
    let boardSize = 20;
    return square[0] < boardSize && square[1] < boardSize && square[0] >= 0 && square[1] >= 0;
  }

}
