import { ActiveSkill } from "../../../Components/Skill/Skill";
import { Character } from "../../../Components/Character/Character";
import { skill_tou_tian_toc } from "../../../../protobuf/proto";
import { GameEventCenter, NetworkEventCenter, UIEventCenter } from "../../../Event/EventTarget";
import { GameEvent, NetworkEventToC, NetworkEventToS, UIEvent } from "../../../Event/type";
import { GamePhase } from "../../../Manager/type";
import { GameData } from "../../../Manager/GameData";
import { Player } from "../../../Components/Player/Player";
import { GameManager } from "../../../Manager/GameManager";
import { CharacterStatus } from "../../Character/type";
import { PlayerAction } from "../../../Utils/PlayerAction/PlayerAction";

export class JiZhi extends ActiveSkill {
  constructor(character: Character) {
    super({
      name: "急智",
      character,
      description: "一名角色濒死时，或争夺阶段，你可以翻开此角色牌，然后摸四张牌。",
      useablePhase: [GamePhase.FIGHT_PHASE],
    });
  }

  get useable() {
    return this.character.status === CharacterStatus.FACE_DOWN;
  }

  init(gameData: GameData, player: Player) {
    NetworkEventCenter.on(
      NetworkEventToC.SKILL_JI_ZHI_TOC,
      (data) => {
        this.onEffect(gameData, data);
      },
      this,
    );
    NetworkEventCenter.on(NetworkEventToC.WAIT_FOR_CHENG_QING_TOC, this.onPlayerDying, this);
  }

  dispose() {
    NetworkEventCenter.off(NetworkEventToC.SKILL_JI_ZHI_TOC);
    NetworkEventCenter.off(NetworkEventToC.WAIT_FOR_CHENG_QING_TOC, this.onPlayerDying, this);
  }

  onPlayerDying(data) {
    if (this.entity) {
      this.entity.useable = true;
      UIEventCenter.once(UIEvent.STOP_COUNT_DOWN, () => {
        this.entity.useable = false;
      });
    }
  }

  onUse(gui: GameManager) {
    PlayerAction.onComplete((data) => {
      NetworkEventCenter.emit(NetworkEventToS.SKILL_JI_ZHI_TOS, {
        seq: gui.seq,
      });
    });
  }

  onEffect(gameData: GameData, { playerId }: skill_tou_tian_toc) {
    const gameLog = gameData.gameLog;
    const player = gameData.playerList[playerId];

    GameEventCenter.emit(GameEvent.PLAYER_USE_SKILL, {
      player,
      skill: this,
    });

    GameEventCenter.emit(GameEvent.SKILL_HANDLE_FINISH, {
      player,
      skill: this,
    });
  }
}
