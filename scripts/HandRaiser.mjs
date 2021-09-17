export default class HandRaiser {
      
    constructor() {
        this.isRaised = false;
        this.userId = game.userId;
        this.moduleName = "raise-my-hand";
    }

    handleSocket(recieveMsg) {
        if (recieveMsg.type == "RAISE") {
            this.raiseById(recieveMsg.playerID);
        }
        else if (recieveMsg.type == "LOWER") {
            this.lowerById(recieveMsg.playerID);
        }
        else {
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
    }

    raiseById(id) {
        if (game.settings.get(this.moduleName, "showEmojiIndicator")) {
            $("[data-user-id='" + id + "'] > .player-name").append("<span class='raised-hand'>✋</span>")
        }

        if (game.settings.get(this.moduleName, "showUiNotification")) {
            let player = game.users.get(id);
            ui.notifications.notify(player.name + " has their hand raised");
        }
        
        if (game.settings.get(this.moduleName, "showUiChatMessage")) {
            let player = game.users.get(id);           
            let message=`<h2>${player.name}</h2>`;
            message+=`<p>${player.name}  has their hand raised</p>`;  
            message+= `<p><img style="vertical-align:middle" src="modules/raise-my-hand/assets/hand.svg" width="100%"></p>`;
            let chatData = {
              content: message
            };  
            ChatMessage.create(chatData, {});  
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
}
