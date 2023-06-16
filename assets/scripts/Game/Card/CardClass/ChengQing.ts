import { GameEventCenter, NetworkEventCenter } from "../../../Event/EventTarget";
import { GameEvent, NetworkEventToS } from "../../../Event/type";
import { Tooltip } from "../../../GameManager/Tooltip";
import { GamePhase } from "../../../GameManager/type";
import { GameData } from "../../../UI/Game/GameWindow/GameData";
import { Player } from "../../Player/Player";
import { Card } from "../Card";
import { CardDefaultOption, CardOnEffectParams, CardType } from "../type";

export class ChengQing extends Card {
  public readonly availablePhases = [GamePhase.MAIN_PHASE];

  constructor(option: CardDefaultOption) {
    super({
      id: option.id,
      name: "澄清",
      type: CardType.CHENG_QING,
      sprite: "images/cards/ChengQing",
      direction: option.direction,
      color: option.color,
      lockable: option.lockable,
      status: option.status,
      gameObject: option.gameObject,
    });
  }

  onSelectedToPlay(gameData: GameData, tooltip: Tooltip) {
    tooltip.setText(`请选择要澄清的目标`);
    gameData.gameObject.startSelectPlayer({
      num: 1,
      filter: (player) => {
        return player.messageCounts.total !== 0;
      },
      onSelect: async (player: Player) => {
        gameData.gameObject.showCardsWindow.show({
          title: "选择一张情报弃置",
          cardList: player.getMessagesCopy(),
          limit: 1,
          buttons: [
            {
              text: "确定",
              onclick: () => {
                NetworkEventCenter.emit(NetworkEventToS.USE_CHENG_QING_TOS, {
                  cardId: this.id,
                  playerId: gameData.gameObject.selectedPlayers.list[0],
                  targetCardId: gameData.gameObject.showCardsWindow.selectedCards.list[0].id,
                  seq: gameData.gameObject.seq,
                });
                gameData.gameObject.showCardsWindow.hide();
                this.onDeselected(gameData);
              },
              enabled: () => !!gameData.gameObject.showCardsWindow.selectedCards.list.length,
            },
            {
              text: "取消",
              onclick: () => {
                gameData.gameObject.showCardsWindow.hide();
                gameData.gameObject.clearSelectedPlayers();
              },
            },
          ],
        });
      },
    });
  }

  onDeselected(gameData: GameData) {
    gameData.gameObject.stopSelectPlayer();
    gameData.gameObject.clearSelectedPlayers();
  }

  onEffect(gameData: GameData, { targetPlayerId, targetCardId }: CardOnEffectParams) {
    const targetPlayer = gameData.playerList[targetPlayerId];
    const message = targetPlayer.removeMessage(targetCardId);
    GameEventCenter.emit(GameEvent.PLAYER_REOMVE_MESSAGE, {
      player: targetPlayer,
      messageList: [message],
    });
  }
}
