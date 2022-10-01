import { describe, it, expect } from "vitest";
import { getSpells, getTranslatedSpell } from "./i18n.js";

describe("getTranslatedSpell", () => {
  it("should return the translated spell", () => {
    const spellEN = getTranslatedSpell("Joobu (1)", "EN");
    expect(spellEN).toBe("Full Cure (1)");
  });
  it("should return the translation for a spell", () => {
    expect(getTranslatedSpell("Arkange (1)", "FR")).toEqual("Arkange (1)");
    expect(getTranslatedSpell("Arkange (1)", "JP")).toEqual("レビテガ (1)");
    expect(getTranslatedSpell("The End (1)", "JP")).toEqual("ジエンド (1)");
    expect(getTranslatedSpell("Wall (1)", "JP")).toEqual("ウォール (1)");
  });
});

describe("getSpells", () => {
  it("should return the translated spells", () => {
    const spellsEN = getSpells("EN");
    expect(spellsEN[0][0][0]).toBe("Full Cure (1)");
  });
});
