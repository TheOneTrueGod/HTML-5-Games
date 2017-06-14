class TurnControls {
  contructor() {
    this.playState = false;
  }

  togglePlay() {
    this.setPlayState(!this.playState);
  }

  setPlayState(state) {
    $('.playButton').removeClass('play').removeClass('pause');
    this.playState = state;
    if (this.playState) {
      $('.playButton').addClass('pause');
    } else {
      $('.playButton').addClass('play');
    }
  }
}

TurnControls = new TurnControls();
