const moduleName = 'raise-my-hand';
import HandRaiser from "./HandRaiser.mjs";

Hooks.once("init", async function () {
  game.keybindings.register(moduleName, "raiseHand", {
    name: 'Raise Hand',
    hint: 'Toogle Raise Hand',
    editable: [{ key: "KeyH", modifiers: []}],
    onDown: () => {
      window.game.handRaiser.isRaised ? window.game.handRaiser.lower() : window.game.handRaiser.raise();
    },
    onUp: () => {},
    restricted: false,  // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  })
});

Hooks.once('ready', function() {
  let handRaiser = new HandRaiser();
  window.game.handRaiser = handRaiser;

  game.settings.register(moduleName, "showEmojiIndicator", {
    name: "Should a raised hand be displayed in the Players list?",
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(moduleName, "showUiNotification", {
    name: "Should a raised hand display a UI notification when raised?",
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(moduleName, "showUiChatMessage", {
    name: "Should a raised hand display a chat message when raised?",
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });
  
  // call this with: game.settings.get("raise-my-hand", "chatimagepath")
  game.settings.register(moduleName, 'chatimagepath', {
    name: 'Chat Image Path',
    hint: 'You can set a path to the image displayed on the chat.',
    scope: 'world',
    config: true,
    default: 'modules/raise-my-hand/assets/hand.svg',
    type: String
  }); 
  
  game.settings.register(moduleName, 'chatimagewidth', {
    name: 'Chat Image Width',
    hint: 'You can set the size of the custom image or player avatar. It is %',
    scope: 'world',
    config: true,
    default: 100,
    range: {
        min: 20,
        max: 100,
        step: 5
    },    
    type: Number
  }); 

  game.settings.register(moduleName, "chatMessageImageUserArt", {
    name: "Should chat image be the user avatar?",
    hint: 'This will use the user avatar as chat image instead of the default image.',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });
  
  game.settings.register(moduleName, "playSound", {
    name: "Should a sound be played when raised?",
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });
  
  // call this with: game.settings.get("raise-my-hand", "warningsoundpath")
  game.settings.register(moduleName, 'warningsoundpath', {
    name: 'Warning Sound Path',
    hint: 'You can set a path to a sound you prefer.',
    scope: 'world',
    config: true,
    default: 'modules/raise-my-hand/assets/bell01.ogg',
    type: String
  });  
  
  // call this with: game.settings.get("raise-my-hand", "warningsoundvolume")
  game.settings.register(moduleName, 'warningsoundvolume', {
    name: 'Warning Sound Volume',
    hint: 'You can set the volume for the warning sound. Use 0.1 for 10% of the volume. 0.6 for 60% of the volume.',
    scope: 'world',
    config: true,
    default: 0.6,
    range: {
        min: 0.2,
        max: 1,
        step: 0.1
    },     
    type: Number
  });

  game.settings.register(moduleName, "shakescreen", {
    name: 'Shake Screen',
    hint: "Should a raised hand shake the screen? THIS REQUIRES THE MODULE Fluid Canvas",
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });

});

Hooks.on("getSceneControlButtons", function(controls) {
  let tileControls = controls.find(x => x.name === "token");
  tileControls.tools.push({
    icon: "fas fa-hand-paper",
    name: "raise-my-hand",
    title: "✋Raise My Hand",
    button: true,
    onClick: () => window.game.handRaiser.toggle()
  });
});
