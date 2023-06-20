import { skill_jin_shen_toc } from "../../../../protobuf/proto";
import { NetworkEventCenter } from "../../../Event/EventTarget";
import { NetworkEventToC, NetworkEventToS } from "../../../Event/type";
import { GameData } from "../../../UI/Game/GameWindow/GameData";
import { TriggerSkill } from "../Skill";
import GamePools from "../../../GameManager/GamePools";
import { GameLog } from "../../GameLog/GameLog";
import { Player } from "../../Player/Player";
import { Character } from "../../Character/Character";

export class JinShen extends TriggerSkill {
  constructor(character: Character) {
    super({
      name: "谨慎",
      character,
      description: "你接收双色情报后，可以用一张手牌与该情报面朝上互换。",
    });
  }

  init(gameData: GameData, player: Player) {
    NetworkEventCenter.on(
      NetworkEventToC.SKILL_JIN_SHEN_TOC,
      (data) => {
        this.onEffect(gameData, data);
      },
      this
    );
  }

  dispose() {
    NetworkEventCenter.off(NetworkEventToC.SKILL_JIN_SHEN_TOC);
  }

  onTrigger(gameData: GameData, params): void {
    const tooltip = gameData.gameObject.tooltip;
    tooltip.setText(`你接收了双色情报，是否使用【谨慎】？`);
    tooltip.buttons.setButtons([
      {
        text: "确定",
        onclick: () => {
          const handCardList = gameData.gameObject.handCardList;
          handCardList.selectedCards.limit = 1;
          tooltip.setText(`请选择一张手牌与接收的情报互换`);
          tooltip.buttons.setButtons([
            {
              text: "确定",
              onclick: () => {
                NetworkEventCenter.emit(NetworkEventToS.SKILL_JIN_SHEN_TOS, {
                  cardId: handCardList.selectedCards.list[0].id,
                  seq: gameData.gameObject.seq,
                });
              },
              enabled: () => {
                return handCardList.selectedCards.list.length === 1;
              },
            },
          ]);
        },
      },
      {
        text: "取消",
        onclick: () => {
          NetworkEventCenter.emit(NetworkEventToS.END_RECEIVE_PHASE_TOS, {
            seq: gameData.gameObject.seq,
          });
        },
      },
    ]);
  }

  onEffect(gameData: GameData, { playerId, card }: skill_jin_shen_toc) {
    const player = gameData.playerList[playerId];
    const gameLog = gameData.gameLog;
    let handCard = player.removeHandCard(card.cardId);
    if (!handCard) {
      player.removeHandCard(0);
      handCard = gameData.createCard(card);
    }
    const messages = player.getMessagesCopy();
    const message = player.removeMessage(messages[messages.length - 1].id);
    player.addHandCard(message);
    player.addMessage(handCard);
    gameLog.addData(new GameLog(`【${player.seatNumber + 1}号】${player.character.name}使用技能【谨慎】`));
    gameLog.addData(
      new GameLog(
        `【${player.seatNumber + 1}号】${player.character.name}将手牌${gameLog.formatCard(
          handCard
        )}和情报${gameLog.formatCard(message)}互换`
      )
    );

    if (playerId === 0) {
      message.gameObject = GamePools.cardPool.get();
      gameData.gameObject.handCardList.removeData(handCard);
      if (gameData.gameObject) {
        gameData.gameObject.cardAction.addCardToHandCard({ player, card: message });
      }
    }
  }
}
