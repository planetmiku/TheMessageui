import { Card } from "../Card";
import { CardColor, CardDefaultOption, CardOnEffectParams, CardType } from "../type";
import { DataEventCenter, NetworkEventCenter } from "../../../Event/EventTarget";
import { DataEvent, NetworkEventToS } from "../../../Event/type";
import { GameData } from "../../../Manager/GameData";
import { GamePhase } from "../../../Manager/type";
import { GameManager } from "../../../Manager/GameManager";
import { GameLog } from "../../GameLog/GameLog";
import { PlayerAction } from "../../../Utils/PlayerAction/PlayerAction";
import { PlayerActionStep } from "../../../Utils/PlayerAction/PlayerActionStep";

export class YuQinGuZong extends Card {
  public readonly availablePhases = [GamePhase.SEND_PHASE_START];
  public messageToReplaced: Card = null;

  get description() {
    return "传递阶段，从你的情报区选择一张红色或蓝色情报，面朝上作为情报传出，然后摸两张牌。";
  }

  constructor(option: CardDefaultOption) {
    super({
      id: option.id,
      name: "欲擒故纵",
      type: CardType.YU_QIN_GU_ZONG,
      direction: option.direction,
      color: option.color,
      lockable: option.lockable,
      status: option.status,
      entity: option.entity,
    });
  }

  canPlay(gui: GameManager) {
    const messageCounts = gui.data.selfPlayer.messageCounts;
    return messageCounts[CardColor.BLUE] + messageCounts[CardColor.RED] > 0;
  }

  onPlay(gui: GameManager): void {
    const showCardsWindow = gui.showCardsWindow;
    PlayerAction.switchToGroup("PlayCard").addStep({
      step: new PlayerActionStep({
        handler: (data, { next, prev }) => {
          showCardsWindow.show({
            title: "请选择一张红色或蓝色情报传出",
            limit: 1,
            cardList: gui.data.selfPlayer.getMessagesCopy(),
            buttons: [
              {
                text: "确定",
                onclick: () => {
                  const sendCard = showCardsWindow.selectedCards.list[0];
                  showCardsWindow.hide();
                  gui.uiLayer.doSendMessage({ message: sendCard });
                  PlayerAction.onComplete((data) => {
                    let d: any = {};
                    for (const item of data) {
                      d = { ...d, ...item };
                    }
                    NetworkEventCenter.emit(NetworkEventToS.USE_YU_QIN_GU_ZONG_TOS, {
                      cardId: this.id,
                      messageCardId: d.sendCard.id,
                      targetPlayerId: d.targetPlayerId,
                      lockPlayerId: d.lockPlayerId,
                      cardDir: d.direction != null ? d.direction : d.sendCard.direction,
                      seq: gui.seq,
                    });
                  });
                  next({ sendCard });
                },
                enabled: () => {
                  const list = showCardsWindow.selectedCards.list;
                  return (
                    list.length > 0 && (Card.hasColor(list[0], CardColor.RED) || Card.hasColor(list[0], CardColor.BLUE))
                  );
                },
              },
              {
                text: "取消",
                onclick: () => {
                  showCardsWindow.hide();
                  prev();
                },
              },
            ],
          });
        },
      }),
    });
  }

  onEffect(
    gameData: GameData,
    { messageCardId, playerId, targetPlayerId, lockPlayerIds, cardDir }: CardOnEffectParams,
  ) {
    const gameLog = gameData.gameLog;
    const player = gameData.playerList[playerId];

    const message = player.removeMessage(messageCardId);

    gameLog.addData(new GameLog(`${gameLog.formatPlayer(player)}选择了${gameLog.formatCard(message)}`));

    DataEventCenter.emit(DataEvent.SEND_MESSAGE, {
      card: message,
      senderId: playerId,
      targetPlayerId,
      lockPlayerIds,
      direction: cardDir,
      fromHand: false,
    });
  }

  copy() {
    return new YuQinGuZong({
      id: this.id,
      direction: this.direction,
      color: this.color?.slice(),
      lockable: this.lockable,
      status: this.status,
    });
  }
}
