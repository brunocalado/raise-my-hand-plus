import HandRaiser from "./HandRaiser.mjs";

Hooks.on("chatCommandsReady", function(chatCommands) {
  game.socket.on("module.raise-my-hand-plus", function(recieveMsg) {
    window.game.handRaiser.handleSocket(recieveMsg);
  });

  chatCommands.registerCommand(chatCommands.createCommandFromData({
    commandKey: "/raisemyhand",
    invokeOnCommand: (chatlog, messageText, chatdata) => {
      window.game.handRaiser.raise();
    },
    shouldDisplayToChat: false,
    iconClass: "fa-hand-paper",
    description: "Show raised hand indicator"
  }));

  chatCommands.registerCommand(chatCommands.createCommandFromData({
    commandKey: "/lowermyhand",
    invokeOnCommand: (chatlog, messageText, chatdata) => {
      window.game.handRaiser.lower();
    },
    shouldDisplayToChat: false,
    iconClass: "fa-hand-paper",
    description: "Lower raised hand indicator"
  }));

  chatCommands.registerCommand(chatCommands.createCommandFromData({
    commandKey: "/rmh",
    invokeOnCommand: (chatlog, messageText, chatdata) => {
      window.game.handRaiser.raise();
    },
    shouldDisplayToChat: false,
    iconClass: "fa-hand-paper",
    description: "Show raised hand indicator"
  }));

  chatCommands.registerCommand(chatCommands.createCommandFromData({
    commandKey: "/lmh",
    invokeOnCommand: (chatlog, messageText, chatdata) => {
      window.game.handRaiser.lower();
    },
    shouldDisplayToChat: false,
    iconClass: "fa-hand-paper",
    description: "Lower raised hand indicator"
  }));

  
});


Hooks.once('ready', function() {
  let moduleName = 'raise-my-hand-plus';

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
  
  // call this with: game.settings.get("raise-my-hand-plus", "chatimagepath")
  game.settings.register('raise-my-hand-plus', 'chatimagepath', {
    name: 'Chat Image Path',
    hint: 'You can set a path to the image displayed on the chat.',
    scope: 'world',
    config: true,
    default: 'modules/raise-my-hand-plus/assets/hand.svg',
    type: String
  }); 
  
  game.settings.register(moduleName, "playSound", {
    name: "Should a sound be played when raised?",
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });
  
  // call this with: game.settings.get("raise-my-hand-plus", "warningsoundpath")
  game.settings.register('raise-my-hand-plus', 'warningsoundpath', {
    name: 'Warning Sound Path',
    hint: 'You can set a path to a sound you prefer.',
    scope: 'world',
    config: true,
    default: 'modules/raise-my-hand-plus/assets/bell01.ogg',
    type: String
  });  
  
  // call this with: game.settings.get("raise-my-hand-plus", "warningsoundvolume")
  game.settings.register('raise-my-hand-plus', 'warningsoundvolume', {
    name: 'Warning Sound Volume',
    hint: 'You can set the volume for the warning sound. Use 0.1 for 10% of the volume. 0.6 for 60% of the volume.',
    scope: 'world',
    config: true,
    default: 0.6,
    type: Number
  });

  game.settings.register(moduleName, "shakescreen", {
    name: "Should a raised hand shake the screen? THIS REQUIRES THE MODULE Fluid Canvas",
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });
  
  if (game.modules.get("lib-df-hotkeys")?.active) {
    Hotkeys.registerGroup({
      name: moduleName,
      label: "Raise My Hand"
    });
    
    Hotkeys.registerShortcut({
      name: `${moduleName}.Toggle`,
      label: "Raise/Lower My Hand",
      group: moduleName,
      default: { key: Hotkeys.keys.KeyR, alt: false, ctrl: false, shift: false },
      onKeyDown: () => window.game.handRaiser.isRaised ? window.game.handRaiser.lower() : window.game.handRaiser.raise()
    });
  }
});

Hooks.on("getSceneControlButtons", function(controls) {
  let tileControls = controls.find(x => x.name === "token");
  tileControls.tools.push({
    icon: "fas fa-hand-paper",
    name: "raise-my-hand-plus",
    title: "✋Raise My Hand",
    button: true,
    onClick: () => window.game.handRaiser.toggle()
  });
});
