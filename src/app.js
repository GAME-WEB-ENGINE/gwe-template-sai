window.addEventListener('load', async () => {
  let { GWE } = require('gwe');
  let { BootScreen } = require('./src/screens/boot_screen');
  
  class Game extends GWE.Application {
    constructor(resolutionWidth, resolutionHeight, sizeMode) {
      super(resolutionWidth, resolutionHeight, sizeMode);
    }
  }

  let game = new Game(800, 800, GWE.SizeModeEnum.FIXED);
  GWE.screenManager.requestSetScreen(new BootScreen(game));
  requestAnimationFrame(ts => game.run(ts));
});