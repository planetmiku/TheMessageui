import { GameEventCenter, NetworkEventCenter } from "../../../Event/EventTarget";
import { GameEvent, NetworkEventToS } from "../../../Event/type";
import { GameData } from "../../../UI/Game/GameWindow/GameData";
import { Card } from "../Card";
import { CardColor, CardDefaultOption, CardOnEffectParams, CardStatus, CardType } from "../type";
import { GamePhase } from "../../../GameManager/type";
import { GameUI } from "../../../UI/Game/GameWindow/GameUI";
import { CardOnEffect } from "../../../Event/GameEventType";

export class PoYi extends Card {
  public readonly availablePhases = [GamePhase.SEND_PHASE];

  constructor(option: CardDefaultOption) {
    super({
      id: option.id,
      name: "破译",
      type: CardType.PO_YI,
      src: "PoYi",
      direction: option.direction,
      color: option.color,
      lockable: option.lockable,
      status: option.status,
      gameObject: option.gameObject,
    });
  }

  onSelectedToPlay(gui: GameUI): void {
    const tooltip = gui.tooltip;
    if (gui.data.messageInTransmit.status === CardStatus.FACE_UP) {
      tooltip.setText(`该情报无需破译`);
    } else {
      tooltip.setText(`是否使用破译？`);
      tooltip.buttons.setButtons([
        {
          text: "确定",
          onclick: () => {
            NetworkEventCenter.emit(NetworkEventToS.USE_PO_YI_TOS, {
              cardId: this.id,
              seq: gui.seq,
            });
          },
        },
      ]);
    }
  }

  onDeselected(gui: GameUI) {}

  onEffect(gameData: GameData, { userId, targetCard }: CardOnEffectParams): void {
    if (userId === 0) {
      const message = gameData.createMessage(targetCard);
      this.showMessageInTransmit(gameData, message);
      const isBlackMessage = Card.hasColor(message, CardColor.BLACK);
      GameEventCenter.emit(GameEvent.CARD_ON_EFFECT, {
        card: this,
        handler: "promptChooseDraw",
        params: {
          isBlackMessage,
        },
      } as CardOnEffect);
    }
  }

  promptChooseDraw(gui: GameUI, params) {
    const isBlackMessage = { params };
    if (isBlackMessage) {
      const tooltip = gui.tooltip;
      tooltip.setText(`是否翻开并摸一张牌？`);
      tooltip.buttons.setButtons([
        {
          text: "确定",
          onclick: () => {
            NetworkEventCenter.emit(NetworkEventToS.PO_YI_SHOW_TOS, {
              show: true,
              seq: gui.seq,
            });
          },
        },
        {
          text: "取消",
          onclick: () => {
            NetworkEventCenter.emit(NetworkEventToS.PO_YI_SHOW_TOS, {
              show: false,
              seq: gui.seq,
            });
          },
        },
      ]);
    } else {
      NetworkEventCenter.emit(NetworkEventToS.PO_YI_SHOW_TOS, {
        show: false,
        seq: gui.seq,
      });
    }
  }

  onShow(gameData: GameData, { userId, targetCard, flag }: CardOnEffectParams) {
    if (flag && userId !== 0) {
      const message = gameData.createMessage(targetCard);
      this.showMessageInTransmit(gameData, message);
    }
  }

  showMessageInTransmit(gameData: GameData, message) {
    message.gameObject = gameData.messageInTransmit.gameObject;
    gameData.messageInTransmit = message;
    message.flip();
  }
}
