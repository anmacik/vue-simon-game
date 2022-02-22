var errorFreq = 190;
var successFreq = 1200;

Vue.component("Game", {
  template:`
  <div class="game">
    <h1>Simon Game</h1>
  <div class="game__content">
      <div class="game__item game__item_1" @click="clicked(1)" :class="{lighted: isLighted[1]}"></div>
      <div class="game__item game__item_2" @click="clicked(2)" :class="{lighted: isLighted[2]}"></div>
      <div class="game__item game__item_3" @click="clicked(3)" :class="{lighted: isLighted[3]}"></div>
      <div class="game__item game__item_4" @click="clicked(4)" :class="{lighted: isLighted[4]}"></div>
  </div>
  <div class="game__start-btn" @click="startGame">{{ centerButton }}
      <span v-show="playing">{{ showScore }}</span>
  </div>
</div>
  `,
  data() {
     return {
       centerButton: "START",
       playing: false,
       isClickable: false,
       isWon: false,
       isWrong: false,
       gameSpeed: 1000,
       activeBtn: 'btn2',
       score: 0,
       sequence: [],
       sequenceInterval: null,
       playerSequence: [],

       isLighted: {
         1: false,
         2: false,
         3: false,
         4: false
       }
     }
   },
  computed: {
    showScore() {
      if (this.isWon) {
        return "Play Again?";
      }
      return "Score: " + this.score;
    }
  },
  methods: {
    startGame() {
      this.playing = true;
      this.sequence = [];
      this.playerSequence = [];
      this.centerButton = "RESET";
      this.isWon = false;
      this.isWrong = false;
      this.score = 0;
      clearInterval(this.sequenceInterval);
      this.showSequence();
    },
    clicked(tile) {
      if (this.isClickable) {
        this.lightUp(tile);
        this.playerSequence.push(tile);
        this.checkWinLose();
      }
    },
    checkWinLose() {
      // check for incorrect
      for (let i = 0; i < this.playerSequence.length; i++) {
        if (this.playerSequence[i] !== this.sequence[i]) {
          this.playerSequence = [];
          this.centerButton = "Wrong!";
          this.isWrong = true;
          setTimeout(() => {
            this.centerButton = "RESET";
            this.isWrong = false;
          }, 1000);
          this.showSequence(true);
        }
      }
      // if all correct and same length , continue
      if (this.playerSequence.length === this.sequence.length) {
        this.playerSequence = [];
        this.score++;
        // if win condition, show win, dont continue.
        if (this.score === 5) {
          this.centerButton = "Winner!";
          this.isClickable = false;
          this.isWon = true;
        } else {
          this.showSequence();
        }
      }
    },
    lightUp(tile) {
      this.isLighted[tile] = true;
      setTimeout(() => {
        this.isLighted[tile] = false;
      }, 300);
    },
    showSequence(failed) {
      let currentIndex = 0;
      let speed = this.sequence.length === 0 ? this.gameSpeed : 1000;
      this.isClickable = false;
      if (!failed) {
        // dont add number on incorrect answers
        this.sequence.push(Math.floor(Math.random() * 4 + 1));
      }
      this.sequenceInterval = setInterval(() => {
        if (currentIndex >= this.sequence.length) {
          clearInterval(this.sequenceInterval);
          return (this.isClickable = true);
        }
        this.lightUp(this.sequence[currentIndex]);
        currentIndex++;
      }, speed);
    },
  }
})

var App= new Vue({
  el:"#App"
})
