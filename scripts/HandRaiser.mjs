export default class HandRaiser {

  constructor() {
    this.isRaised = false;
    this.userId = game.userId;
    this.moduleName = "raise-my-hand";
    
    this.socket = socketlib.registerModule(this.moduleName);       	
  	this.socket.register("sendNotification", this.sendNotification);
    this.socket.register("shakeTheScreen", this.shakeTheScreen);    
  }

  handleSocket(recieveMsg) {
    if (recieveMsg.type == "RAISE") {
      this.raiseById(recieveMsg.playerID);
    } else if (recieveMsg.type == "LOWER") {
      this.lowerById(recieveMsg.playerID);
    } else {
      console.error("Unexpected socket message type - " + recieveMsg.type);
    }
  }

  toggle() {
    if (this.isRaised) this.lower();
    else this.raise();
  }

  raise() {
    if (this.isRaised) return;
    this.raiseById(this.userId);
    this.isRaised = true;

    let msg = {
      type: "RAISE",
      playerID: this.userId
    };
    game.socket.emit("module.raise-my-hand", msg);

    // ======================================
    // CHAT
    if (game.settings.get(this.moduleName, "showUiChatMessage")) {
      let player = game.users.get(this.userId);
      let imagePath;
      let chatImageWidth = game.settings.get(this.moduleName, "chatimagewidth");
      let chatData;
      const showImageChatMessage = game.settings.get(this.moduleName, "showImageChatMessage");

      if (showImageChatMessage) {
        if (game.settings.get(this.moduleName, "chatMessageImageUserArt")) {
          imagePath = player.data.avatar;
        } else {
          imagePath = game.settings.get("raise-my-hand", "chatimagepath");
        }
        chatData = {
          speaker: null,
          content: `<div style="position:relative; background: #ddd9d5;padding: 0.5rem; margin-left:-7px;margin-right:-7px;margin-bottom:-7px;margin-top:-27px"><label class="titulo" style="font-size:35px; color: #b02b2e;">${player.name}</label><div style="position: absolute;top: 0;right: 0;width: 50px;height:50px;background: linear-gradient(45deg, #00000000 50%, ${player.color} 50%);"></div><br><label style="font-size: 15px">has their hand raised!</label><div style="margin-top:5px ;height: 5px;width: 100%;background: linear-gradient(20deg,  #000000 70%, #ddd9d500 70%);"></div><p><img style="vertical-align:middle" src="${imagePath}" width="${chatImageWidth}%"></p></div>`
        };
      } else {
        chatData = {
          speaker: null,
          content: `<div style="position:relative; background: #ddd9d5;padding: 0.5rem; margin-left:-7px;margin-right:-7px;margin-bottom:-7px;margin-top:-27px"><label class="titulo" style="font-size:35px; color: #b02b2e;">${player.name}</label><div style="position: absolute;top: 0;right: 0;width: 50px;height:50px;background: linear-gradient(45deg, #00000000 50%, ${player.color} 50%);"></div><br><label style="font-size: 15px"></label><div style="margin-top:5px ;height: 5px;width: 100%;background: linear-gradient(20deg,  #000000 70%, #ddd9d500 70%);"></div><p><label style="font-size: 15px">has their hand raised!</label></p></div>`
        };
      }

      ChatMessage.create(chatData, {});
    }

    if (game.settings.get(this.moduleName, "playSound")) {
      const soundVolume = game.settings.get("raise-my-hand", "warningsoundvolume");
      const mySound = game.settings.get("raise-my-hand", "warningsoundpath"); //const mySound = 'modules/raise-my-hand/assets/bell01.ogg';
      AudioHelper.play({
        src: mySound,
        volume: soundVolume,
        autoplay: true,
        loop: false
      }, true);
    }
  }

  raiseById(id) {
    if (game.settings.get(this.moduleName, "showEmojiIndicator")) {
      $("[data-user-id='" + id + "'] > .player-name").append("<span class='raised-hand'>✋</span>")
    }

    if (game.settings.get(this.moduleName, "showUiNotification")) {
      let player = game.users.get(id);
    	//let socket = socketlib.registerModule(this.moduleName);       	
      //https://github.com/manuelVo/foundryvtt-socketlib#socketexecuteforeveryone
      this.socket.executeForEveryone(this.sendNotification, player);      
      console.log(player)
    }  

    // shake screen
    if (game.settings.get(this.moduleName, "shakescreen")) {
      //let socket = socketlib.registerModule(this.moduleName);   
      //https://github.com/manuelVo/foundryvtt-socketlib#socketexecuteforeveryone            
      this.socket.executeForEveryone(this.shakeTheScreen); 
    }
  }

  lower() {
    if (!this.isRaised) return;
    this.lowerById(this.userId);
    this.isRaised = false;

    let msg = {
      type: "LOWER",
      playerID: this.userId
    };
    game.socket.emit("module.raise-my-hand", msg);
  }

  lowerById(id) {
    $("[data-user-id='" + id + "'] > .player-name > .raised-hand").remove();
  }
  
  sendNotification(player) {
    ui.notifications.notify(player.name + " has their hand raised");
  }   
  
  shakeTheScreen() {
    const intensity = 1;
    const duration = 500;
    const iteration = 3;
    FluidCanvas.earthquake(intensity, duration, iteration);
  } 
}