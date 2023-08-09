import { skill_tou_tian_toc } from "../../../../protobuf/proto";
import { GameEventCenter, NetworkEventCenter } from "../../../Event/EventTarget";
import { GameEvent, NetworkEventToC, NetworkEventToS } from "../../../Event/type";
import { GamePhase } from "../../../Manager/type";
import { GameData } from "../../../Manager/GameData";
import { GameManager } from "../../../Manager/GameManager";
import { Character } from "../../../Components/Chatacter/Character";
import { GameLog } from "../../../Components/GameLog/GameLog";
import { Player } from "../../../Components/Player/Player";
import { ActiveSkill } from "../../../Components/Skill/Skill";
import { CharacterStatus } from "../../Chatacter/type";

export class TouTian extends ActiveSkill {
  constructor(character: Character) {
    super({
      name: "偷天",
      character,
      description: "争夺阶段，你可以翻开此角色牌，然后视为你使用了一张【截获】。",
      useablePhase: [GamePhase.FIGHT_PHASE],
    });
  }

  get useable() {
    return this.character.status === CharacterStatus.FACE_DOWN;
  }

  init(gameData: GameData, player: Player) {
    NetworkEventCenter.on(
      NetworkEventToC.SKILL_TOU_TIAN_TOC,
      (data) => {
        this.onEffect(gameData, data);
      },
      this
    );
  }

  dispose() {
    NetworkEventCenter.off(NetworkEventToC.SKILL_TOU_TIAN_TOC);
  }

  onUse(gui: GameManager) {
    const tooltip = gui.tooltip;
    if (gui.data.messagePlayerId === 0) {
      tooltip.setText(`情报在你面前，不能使用【偷天】`);
    } else {
      tooltip.setText(`是否使用【偷天】？`);
    }
    tooltip.buttons.setButtons([
      {
        text: "确定",
        onclick: () => {
          NetworkEventCenter.emit(NetworkEventToS.SKILL_TOU_TIAN_TOS, {
            seq: gui.seq,
          });
        },
        enabled: gui.data.messagePlayerId !== 0,
      },
      {
        text: "取消",
        onclick: () => {
          gui.uiLayer.playerActionManager.switchToDefault();
          this.gameObject.isOn = false;
        },
      },
    ]);
  }

  onEffect(gameData: GameData, { playerId }: skill_tou_tian_toc) {
    GameEventCenter.emit(GameEvent.PLAYER_USE_SKILL, this);

    const gameLog = gameData.gameLog;
    const player = gameData.playerList[playerId];
    gameLog.addData(new GameLog(`${gameLog.formatPlayer(player)}使用技能【偷天】`));

    GameEventCenter.emit(GameEvent.SKILL_HANDLE_FINISH, this);
  }
}
