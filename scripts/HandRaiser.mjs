export default class HandRaiser {

  constructor() {
    this.isRaised = false;
    this.userId = game.userId;
    this.moduleName = "raise-my-hand";
    
    // socketlib
    this.socket = socketlib.registerModule(this.moduleName);       	
  	this.socket.register("sendNotification", this.sendNotification);
    this.socket.register("shakeTheScreen", this.shakeTheScreen);    
    this.socket.register("showHandForEveryone", this.showHandForEveryone); // SHOW HAND FOR EVERYONE
    this.socket.register("removeHandForEveryone", this.removeHandForEveryone); // REMOVE HAND FOR EVERYONE
  }

  toggle() {
    if (game.settings.get(this.moduleName, "handToogleBehavior")) {
      if (this.isRaised) this.lower();
      else this.raise();
    } else {
      this.raise();      
    }      
  }

  raise() {
    const id = this.userId;
    if (game.settings.get(this.moduleName, "handToogleBehavior")) {
      if (this.isRaised) return;    
      this.isRaised = true;
      
      if (game.settings.get(this.moduleName, "showEmojiIndicator")) { // SHOW HAND NEXT TO PLAYER NAME
        this.socket.executeForEveryone(this.showHandForEveryone, id);              
      }
    } 
    
    // SHOW NOTIFICATION
    if (game.settings.get(this.moduleName, "showUiNotification")) {
      let player = game.users.get(id);
      if (game.settings.get(this.moduleName, "showUiNotificationOnlyToGM")) {
        //https://github.com/manuelVo/foundryvtt-socketlib#socketexecuteforallgms
        const permanentFlag = game.settings.get(this.moduleName, "makeUiNotificationPermanent");
        this.socket.executeForAllGMs(this.sendNotification, player, permanentFlag);                    
      } else {
        //https://github.com/manuelVo/foundryvtt-socketlib#socketexecuteforeveryone
        const permanentFlag = game.settings.get(this.moduleName, "makeUiNotificationPermanent");
        this.socket.executeForEveryone(this.sendNotification, player, permanentFlag);              
      }
    }  

    // SHAKE SCREEN
    if (game.settings.get(this.moduleName, "shakescreen")) {
      //https://github.com/manuelVo/foundryvtt-socketlib#socketexecuteforeveryone            
      this.socket.executeForEveryone(this.shakeTheScreen); 
    }

    // ======================================
    // CHAT
    if (game.settings.get(this.moduleName, "showUiChatMessage")) {
      let player = game.users.get(this.userId);
      let imagePath;
      let chatImageWidth = game.settings.get(this.moduleName, "chatimagewidth");
      let chatData;
      const showImageChatMessage = game.settings.get(this.moduleName, "showImageChatMessage");
      let message='';
      if (showImageChatMessage) {
        if (game.settings.get(this.moduleName, "chatMessageImageUserArt")) {
          imagePath = player.data.avatar;
        } else {
          imagePath = game.settings.get("raise-my-hand", "chatimagepath");
        }
        message += `<label class="titulo" style="font-size:35px; color: #b02b2e;">${player.name}</label></br><label style="font-size: 15px">${game.i18n.localize("raise-my-hand.CHATMESSAGE")}</label><p><img style="vertical-align:middle" src="${imagePath}" width="${chatImageWidth}%"></p>`; 
      } else {
        message += `<label class="titulo" style="font-size:35px; color: #b02b2e;">${player.name}</label></br><label style="font-size: 15px">${game.i18n.localize("raise-my-hand.CHATMESSAGE")}</label>`; 
      }
      
      if (game.settings.get(this.moduleName, "showUiChatMessageOnlyForGM")) {
        chatData = {
          speaker: null,
          content: message,
          whisper : ChatMessage.getWhisperRecipients("GM")          
        }; // has their hand raised!
      } else {
        chatData = {
          speaker: null,
          content: message
        }; // has their hand raised!        
      }
      ChatMessage.create(chatData, {});
    } // END CHAT
  
    // SOUND
    if (game.settings.get(this.moduleName, "playSound")) {
      const soundVolume = game.settings.get("raise-my-hand", "warningsoundvolume");
      const mySound = game.settings.get("raise-my-hand", "warningsoundpath"); //const mySound = 'modules/raise-my-hand/assets/bell01.ogg';
      AudioHelper.play({
        src: mySound,
        volume: soundVolume,
        autoplay: true,
        loop: false
      }, true);
    } // END SOUND
  }

  lower() {
    const id = this.userId;
    if (!this.isRaised) return;
    this.isRaised = false;
    if (game.settings.get(this.moduleName, "showEmojiIndicator")) {
      this.socket.executeForEveryone(this.removeHandForEveryone, id);              
    }
  }

  sendNotification(player, permanentFlag) {    
    ui.notifications.notify( '✋ ' + player.name + game.i18n.localize("raise-my-hand.UINOTIFICATION"), 'info', {permanent: permanentFlag} ); 
  }   

  showHandForEveryone(id) {       //THIS WILL ADD THE HAND
    $("[data-user-id='" + id + "'] > .player-name").append("<span class='raised-hand'>✋</span>");
  }   

  removeHandForEveryone(id) {     //THIS WILL REMOVE THE HAND
    $("[data-user-id='" + id + "'] > .player-name > .raised-hand").remove();
  }   
  
  shakeTheScreen() {
    const intensity = 1;
    const duration = 500;
    const iteration = 3;
    
    if (game.modules.get('kandashis-fluid-canvas')?.active) { 
      FluidCanvas.earthquake(intensity, duration, iteration);
    } else {
      ui.notifications.error( '✋ ' + game.i18n.localize("raise-my-hand.kandashisfluidcanvas") ); //
    }       
  } 
}