import {Component, OnInit, OnDestroy} from '@angular/core';
import {LoginService} from "../../services/login.service";
import {Game} from "../../models/game";
import {Gameplay} from "../../models/gameplay";
import {Router} from "@angular/router";
import {UpdateGame} from "../../models/updateGame";
import {GameService} from "../../services/game.service";
import {UserService} from "../../services/user.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-ttt',
  templateUrl: './ttt.component.html',
  styleUrls: ['./ttt.component.scss']
})

export class TttComponent implements OnInit, OnDestroy {
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
  arrayLength = 20;
  board = Array(this.arrayLength).fill(null).map(() => Array(this.arrayLength));
  subscriptions: Subscription[] = [];

  constructor(private loginService: LoginService,
              private gameService: GameService,
              private userService: UserService) {
    //window.onunload = function () {
    //  return loginService.silentLogout();
    //};
  }
  ngOnDestroy(): void {
    this.ws.close()
    this.gameWs.close()
    this.subscriptions.forEach(subscription =>subscription.unsubscribe())
  }
  ngOnInit(): void {
    this.numbers = Array.from(Array(this.arrayLength)).map((x, i) => i);
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
        this.subscriptions.push(this.userService.updateUser({username:game.user1,online:true,inGame:true}).subscribe())
      }
      if (game.user2 === this.currentUser.username) {
        if (confirm(game.user1 + " asked you to play, Do you want to join?")) {
          this.join(game.id, game.user1, game.user2)
          this.subscriptions.push(this.userService.updateUser({username:game.user2,online:true,inGame:true}).subscribe())
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
      if (message.data.startsWith("WON")){
        let updateGame: UpdateGame = {id:id, winner:message.data.substring(4), isPending:false, isFinished: true}
        this.subscriptions.push(this.gameService.updateGame(updateGame).subscribe())
        this.isGameOn = false;
        this.gameWs.close()
        alert("User " + message.data.substring(4) + " WON!")
        this.subscriptions.push(this.userService.updateUser({username:user1,online:true,inGame:false}).subscribe())
        this.subscriptions.push(this.userService.updateUser({username:user2,online:true,inGame:false}).subscribe())
        this.board = Array(this.arrayLength).fill(null).map(() => Array(this.arrayLength));
        this.numbers = Array.from(Array(this.arrayLength)).map((x, i) => i);
        location.reload()
      }else{
      let move: Gameplay = JSON.parse(message.data);
      if (move.id === this.currentGamePlay.id) {

        // @ts-ignore
        let x = document.getElementById('myTable').rows[move.x].cells;
        x[move.y].innerHTML = "<span style='disabled'>" + move.shape + "</span>";
        if (this.currentGamePlay.isWinner) {
          this.gameWs.send("WON "+this.currentGamePlay.user)
        }
        if (move.user === user1) {
          this.currentGamePlay.user = user2;
          this.currentGamePlay.shape = "O";
        } else {
          this.currentGamePlay.user = user1;
          this.currentGamePlay.shape = "X"
        }

      }


        }

      }

    }
  play (currentGamePlay: Gameplay): void {

        //TODO: Request to api update DB.
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
                  currentGamePlay.isWinner = true
                }
              }
              if (currentGamePlay.shape === "O"){
                let win = this.checkWin("O",[currentGamePlay.x,currentGamePlay.y])
                if (!win){
                  this.board[currentGamePlay.x][currentGamePlay.y] = "O"
                } else{
                  currentGamePlay.isWinner = true
                }
              }
            this.gameWs.send(JSON.stringify(currentGamePlay))
            }
          }
        }, false);
      }

  checkWin(shape:string, move: any) {
    let minimumLength = 5;
    let lineDirections = [
      [0, 1], //horizontal check -
      [1, 0], //vertical check |
      [1, -1], //diagonal check --> \
      [1, 1] //diagonal check --> /
    ];
    let won = false;
    for (let i = 0; i < lineDirections.length && !won; i++) {
      let shift = lineDirections[i];
      let currentSurounding = [move[0] + shift[0], move[1] + shift[1]];
      let lineLength = 1;

      while (lineLength < minimumLength && this.legalSquare(currentSurounding) && this.board[currentSurounding[0]][currentSurounding[1]] === shape) {
        lineLength++;
        currentSurounding[0] += shift[0];
        currentSurounding[1] += shift[1];
      }

      currentSurounding = [move[0] - shift[0], move[1] - shift[1]];
      while (lineLength < minimumLength && this.legalSquare(currentSurounding) && this.board[currentSurounding[0]][currentSurounding[1]] === shape) {
        lineLength++;
        currentSurounding[0] -= shift[0];
        currentSurounding[1] -= shift[1];
      }
      if (lineLength >= minimumLength)
        won = true;
    }
    return won;
  }
  legalSquare(square:any) {
    return square[0] < this.arrayLength && square[1] < this.arrayLength && square[0] >= 0 && square[1] >= 0;
  }

}
