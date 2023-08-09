import { Character } from "./Character";
import { CharacterObject } from "./CharacterObject";
import { CharacterType } from "./type";
import { AFuLuoLa } from "./CharacterClass/AFuLuoLa";
import { BaiCangLang } from "./CharacterClass/BaiCangLang";
import { BaiFeiFei } from "./CharacterClass/BaiFeiFei";
import { BaiKunShan } from "./CharacterClass/BaiKunShan";
import { BaiXiaoNian } from "./CharacterClass/BaiXiaoNian";
import { ChengXiaoDie } from "./CharacterClass/ChengXiaoDie";
import { DuanMuJing } from "./CharacterClass/DuanMuJing";
import { FeiYuanLongChuan } from "./CharacterClass/FeiYuanLongChuan";
import { GuXiaoMeng } from "./CharacterClass/GuXiaoMeng";
import { GuXiaoMengSP } from "./CharacterClass/GuXiaoMengSP";
import { GuiJiao } from "./CharacterClass/GuiJiao";
import { HanMei } from "./CharacterClass/HanMei";
import { HuangJiRen } from "./CharacterClass/HuangJiRen";
import { JinShengHuo } from "./CharacterClass/JinShengHuo";
import { LaoBie } from "./CharacterClass/LaoBie";
import { LaoHan } from "./CharacterClass/LaoHan";
import { LiNingYu } from "./CharacterClass/LiNingYu";
import { LiNingYuSP } from "./CharacterClass/LiNingYuSP";
import { LiXing } from "./CharacterClass/LiXing";
import { LianYuan } from "./CharacterClass/LianYuan";
import { MaoBuBa } from "./CharacterClass/MaoBuBa";
import { PeiLing } from "./CharacterClass/PeiLing";
import { ShangYu } from "./CharacterClass/ShangYu";
import { ShaoXiu } from "./CharacterClass/ShaoXiu";
import { UnknownCharacter } from "./CharacterClass/UnknownCharacter";
import { WangFuGui } from "./CharacterClass/WangFuGui";
import { WangKui } from "./CharacterClass/WangKui";
import { WangTianXiang } from "./CharacterClass/WangTianXiang";
import { WuZhiGuo } from "./CharacterClass/WuZhiGuo";
import { XiaoJiu } from "./CharacterClass/XiaoJiu";
import { XuanQingZi } from "./CharacterClass/XuanQingZi";
import { ZhangYiTing } from "./CharacterClass/ZhangYiTing";
import { ZhengWenXian } from "./CharacterClass/ZhengWenXian";
import { MaLiYa } from "./CharacterClass/MaLiYa";
import { QianMin } from "./CharacterClass/QianMin";
import { ChiJingHai } from "./CharacterClass/ChiJingHai";
import { HanMeiSP } from "./CharacterClass/HanMeiSP";
import { QinYuanYuan } from "./CharacterClass/QinYuanYuan";
import { LianYuanSP } from "./CharacterClass/LianYuanSP";

const charactersMap: { [index: number]: { new (option?: any): Character } } = {};
charactersMap[0] = UnknownCharacter;
charactersMap[1] = WuZhiGuo;
charactersMap[2] = ChengXiaoDie;
charactersMap[3] = LianYuan;
charactersMap[4] = MaoBuBa;
charactersMap[5] = ZhangYiTing;
charactersMap[6] = BaiCangLang;
charactersMap[7] = FeiYuanLongChuan;
charactersMap[8] = PeiLing;
charactersMap[9] = HuangJiRen;
charactersMap[10] = WangTianXiang;
charactersMap[11] = LiXing;
charactersMap[12] = WangKui;
charactersMap[13] = AFuLuoLa;
charactersMap[14] = HanMei;
charactersMap[15] = ZhengWenXian;
charactersMap[16] = XuanQingZi;
charactersMap[17] = GuiJiao;
charactersMap[18] = ShaoXiu;
charactersMap[19] = JinShengHuo;
charactersMap[20] = GuXiaoMeng;
charactersMap[21] = BaiFeiFei;
charactersMap[22] = DuanMuJing;
charactersMap[23] = WangFuGui;
charactersMap[24] = LaoHan;
charactersMap[25] = BaiXiaoNian;
charactersMap[26] = LaoBie;
charactersMap[27] = XiaoJiu;
charactersMap[28] = LiNingYu;
charactersMap[29] = BaiKunShan;
charactersMap[30] = ShangYu;
charactersMap[31] = MaLiYa;
charactersMap[32] = QianMin;
charactersMap[33] = ChiJingHai;
charactersMap[34] = QinYuanYuan;
charactersMap[1003] = LianYuanSP;
charactersMap[1014] = HanMeiSP;
charactersMap[1020] = GuXiaoMengSP;
charactersMap[1028] = LiNingYuSP;

export function createCharacterById(id: CharacterType, gameObject?: CharacterObject): Character {
  if (charactersMap[id]) {
    return new charactersMap[id](gameObject);
  } else {
    return new charactersMap[0](gameObject);
  }
}
