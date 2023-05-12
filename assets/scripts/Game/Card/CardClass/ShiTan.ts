import { NetworkEventCenter, ProcessEventCenter } from "../../../Event/EventTarget";
import { NetworkEventToS, ProcessEvent } from "../../../Event/type";
import { GameData } from "../../../UI/Game/GameWindow/GameData";
import { Card } from "../Card";
import { ShiTanOption, CardType, CardColor, CardOnEffectParams, CardStatus, CardDirection } from "../type";
import { GamePhase } from "../../../GameManager/type";
import { Tooltip } from "../../../GameManager/Tooltip";

export class ShiTan extends Card {
  public readonly availablePhases = [GamePhase.MAIN_PHASE];
  private _drawCardColor: CardColor[];

  get drawCardColor() {
    return this._drawCardColor;
  }

  constructor(option: ShiTanOption) {
    super({
      id: option.id,
      name: "试探",
      type: CardType.SHI_TAN,
      sprite: "images/cards/ShiTan",
      direction: option.direction,
      color: option.color,
      lockable: option.lockable,
      status: option.status,
      gameObject: option.gameObject,
    });
    this._drawCardColor = option.drawCardColor;
  }

  onSelectedToPlay(gameData: GameData, tooltip: Tooltip): void {
    gameData.gameObject.selectedPlayers.limit = 1;
    tooltip.setText(`请选择要试探的目标`);
    ProcessEventCenter.on(ProcessEvent.SELECT_PLAYER, () => {
      tooltip.setText(`是否使用试探？`);
      tooltip.buttons.setButtons([
        {
          text: "确定",
          onclick: () => {
            const card = gameData.gameObject.handCardList.selectedCards.list[0];
            const player = gameData.gameObject.selectedPlayers.list[0];
            NetworkEventCenter.emit(NetworkEventToS.USE_SHI_TAN_TOS, {
              cardId: card.id,
              playerId: player.id,
              seq: gameData.gameObject.seq,
            });
            gameData.gameObject.resetSelectPlayer();
            gameData.gameObject.selectedPlayers.limit = 0;
            ProcessEventCenter.off(ProcessEvent.SELECT_PLAYER);
          },
        },
      ]);
    });
  }

  onDeselected(gameData: GameData, tooltip: Tooltip) {
    gameData.gameObject.resetSelectPlayer();
    gameData.gameObject.selectedPlayers.limit = 0;
    ProcessEventCenter.off(ProcessEvent.SELECT_PLAYER);
  }

  onPlay() {
  }

  onEffect(gameData: GameData, { userId, flag }: CardOnEffectParams) {}

  onShow(gameData: GameData, { userId, targetPlayerId, card }: CardOnEffectParams) {
    //自己是被试探的目标时展示那张试探牌
    if (targetPlayerId === 0) {
      const shiTanCard = gameData.createCard(card);
      shiTanCard.gameObject = gameData.cardOnPlay.gameObject;
      gameData.cardOnPlay = shiTanCard;
    }
  }
}
