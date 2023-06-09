import { NetworkEventCenter } from "../../../Event/EventTarget";
import { NetworkEventToS } from "../../../Event/type";
import { GameData } from "../../../UI/Game/GameWindow/GameData";
import { CardDirection } from "../../Card/type";
import { Player } from "../../Player/Player";
import { PassiveSkill } from "../Skill";
import { Character } from "../../Character/Character";

export class LianLuo extends PassiveSkill {
  constructor(character: Character) {
    super({
      name: "联络",
      character,
      description: "你传出情报时，可以将情报牌上的箭头视作任意方向。",
    });
  }

  init(gameData: GameData, player: Player) {
    if (player.id === 0) {
      //自己拥有联络技能时修改默认传递情报方法
      gameData.gameObject.doSendMessage = async function () {
        const card = this.handCardList.selectedCards.list[0];
        const data: any = {
          cardId: card.id,
          lockPlayerId: [],
          cardDir: card.direction,
          seq: this.seq,
        };

        await (() => {
          return new Promise((resolve, reject) => {
            this.tooltip.setText("请选择情报传递的方向");
            this.tooltip.buttons.setButtons([
              {
                text: "左",
                onclick: () => {
                  data.cardDir = CardDirection.LEFT;
                  resolve(null);
                },
              },
              {
                text: "上",
                onclick: () => {
                  data.cardDir = CardDirection.UP;
                  resolve(null);
                },
              },
              {
                text: "右",
                onclick: () => {
                  data.cardDir = CardDirection.RIGHT;
                  resolve(null);
                },
              },
            ]);
          });
        })();

        await (() => {
          return new Promise((resolve, reject) => {
            switch (card.direction) {
              case CardDirection.LEFT:
                data.targetPlayerId = this.data.playerList.length - 1;
                resolve(null);
                break;
              case CardDirection.RIGHT:
                data.targetPlayerId = 1;
                resolve(null);
                break;
              case CardDirection.UP:
                this.tooltip.setText("请选择要传递情报的目标");
                this.tooltip.buttons.setButtons([]);
                this.startSelectPlayer({
                  num: 1,
                  filter: (player) => {
                    return player.id !== 0;
                  },
                  onSelect: (player) => {
                    data.targetPlayerId = player.id;
                    resolve(null);
                  },
                });
                break;
            }
          });
        })();

        if (card.lockable) {
          await (() => {
            return new Promise((resolve, reject) => {
              switch (card.direction) {
                case CardDirection.LEFT:
                case CardDirection.RIGHT:
                  this.tooltip.setText("请选择一名角色锁定");
                  this.startSelectPlayer({
                    num: 1,
                    filter: (player) => {
                      return player.id !== 0;
                    },
                  });
                  break;
                case CardDirection.UP:
                  this.tooltip.setText("是否锁定该角色");
                  break;
              }
              this.tooltip.buttons.setButtons([
                {
                  text: "锁定",
                  onclick: () => {
                    switch (card.direction) {
                      case CardDirection.LEFT:
                      case CardDirection.RIGHT:
                        data.lockPlayerId = [this.selectedPlayers.list[0].id];
                        break;
                      case CardDirection.UP:
                        data.lockPlayerId = [data.targetPlayerId];
                        break;
                    }
                    this.handCardList.selectedCards.limit = 0;
                    resolve(null);
                  },
                  enabled: () => {
                    return this.selectedPlayers.list.length === 1;
                  },
                },
                {
                  text: "不锁定",
                  onclick: () => {
                    this.handCardList.selectedCards.limit = 0;
                    resolve(null);
                  },
                },
              ]);
            });
          })();
        }

        NetworkEventCenter.emit(NetworkEventToS.SEND_MESSAGE_CARD_TOS, data);
        this.scheduleOnce(() => {
          this.stopSelectPlayer();
          this.clearSelectedPlayers();
        }, 0);
      }.bind(gameData.gameObject);
    }
  }

  dispose() {}
}
