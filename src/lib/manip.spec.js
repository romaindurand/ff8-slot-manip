import { describe, it, expect } from "vitest";
import {
  computeDoOver1,
  computeFastDoOver,
  generateComputedTable,
  computeManip,
  getTranslatedSpell,
  filterComputedTable,
} from "./manip";
import spellTable from "../data/table.json";

describe("compute fast do over", () => {
  it("should compute a fast do over", async () => {
    expect(computeFastDoOver(235, 183)).toEqual(51);
  });
});

describe("compute do over 1", () => {
  it("should compute do over 1", async () => {
    expect(computeDoOver1(46)).toEqual(11);
    expect(computeDoOver1(42)).toEqual(10);
    expect(computeDoOver1(0)).toEqual(0);
  });
});

describe("compute manip", () => {
  it("should compute manip for Any% rng 125", async () => {
    let category = "Any%";
    let currentCrisis = 1;
    let currentTable = 2;
    let rng = 125;
    let spellOrder = 2;
    let computedTable = generateComputedTable({
      currentHp: 34,
      auraChecked: false,
      blindChecked: false,
      silenceChecked: false,
      slowChecked: false,
      maxHp: 482,
      category,
      deadCharacters: 0,
      spellTable,
    });
    expect(
      computeManip(
        currentTable,
        currentCrisis,
        rng,
        category,
        computedTable,
        spellOrder,
        "The End (1)"
      )
    ).toEqual({
      doOver1: 11,
      skipTurn: 2,
      doOver2: 0,
    });
  });

  it("should compute manip for any% rng 203", async () => {
    let category = "Any%";
    let currentCrisis = 2;
    let currentTable = 4;
    let rng = 203;
    let spellOrder = 2;
    let computedTable = generateComputedTable({
      currentHp: 34,
      auraChecked: false,
      blindChecked: false,
      silenceChecked: false,
      slowChecked: false,
      maxHp: 482,
      category,
      deadCharacters: 0,
      spellTable,
    });
    expect(
      computeManip(
        currentTable,
        currentCrisis,
        rng,
        category,
        computedTable,
        spellOrder,
        "The End (1)"
      )
    ).toEqual({
      doOver1: 4,
      skipTurn: 4,
      doOver2: 51,
    });
  });

  it("should compute manip for 100% rng 203", async () => {
    let category = "100%";
    let currentCrisis = 3;
    let currentTable = 4;
    let rng = 203;
    let spellOrder = 2;
    let computedTable = generateComputedTable({
      currentHp: 34,
      auraChecked: false,
      blindChecked: false,
      silenceChecked: false,
      slowChecked: false,
      maxHp: 482,
      category,
      deadCharacters: 0,
      spellTable,
    });
    expect(
      computeManip(
        currentTable,
        currentCrisis,
        rng,
        category,
        computedTable,
        spellOrder,
        "The End (1)"
      )
    ).toEqual({
      doOver1: 2,
      skipTurn: 12,
      doOver2: 51,
    });
  });

  it("should compute manip for 100% rng 203 with aura checked", async () => {
    let category = "100%";
    let currentCrisis = 4;
    let currentTable = 4;
    let rng = 203;
    let spellOrder = 2;
    let computedTable = generateComputedTable({
      currentHp: 34,
      auraChecked: true,
      blindChecked: false,
      silenceChecked: false,
      slowChecked: false,
      maxHp: 9576,
      category,
      deadCharacters: 0,
      spellTable,
    });
    expect(
      computeManip(
        currentTable,
        currentCrisis,
        rng,
        category,
        computedTable,
        spellOrder,
        "The End (1)"
      )
    ).toEqual({ fastDoOver: 57 });
  });

  it("should compute manip for 100% rng 150 with aura checked", async () => {
    let category = "100%";
    let currentCrisis = 4;
    let currentTable = 1;
    let rng = 150;
    let spellOrder = 2;
    let computedTable = generateComputedTable({
      currentHp: 34,
      auraChecked: true,
      blindChecked: false,
      silenceChecked: false,
      slowChecked: false,
      maxHp: 9576,
      category,
      deadCharacters: 0,
      spellTable,
    });
    expect(
      computeManip(
        currentTable,
        currentCrisis,
        rng,
        category,
        computedTable,
        spellOrder,
        "The End (1)"
      )
    ).toEqual({ doOver1: 0, skipTurn: 9, doOver2: 3 });
  });

  it("should compute manip for Any% rng 32", async () => {
    let category = "Any%";
    let currentCrisis = 3;
    let currentTable = 3;
    let rng = 32;
    let spellOrder = 2;
    let computedTable = generateComputedTable({
      currentHp: 34,
      auraChecked: false,
      blindChecked: false,
      silenceChecked: false,
      slowChecked: false,
      maxHp: 482,
      category,
      deadCharacters: 0,
      spellTable,
    });
    expect(
      computeManip(
        currentTable,
        currentCrisis,
        rng,
        category,
        computedTable,
        spellOrder,
        "The End (1)"
      )
    ).toEqual({ doOver1: 34, skipTurn: 3, doOver2: 0 });
  });

  it("should compute manip for 100% rng 203 for arkange with 34 hp", async () => {
    let category = "100%";
    let currentCrisis = 3;
    let currentTable = 3;
    let rng = 216;
    let spellOrder = 1;
    let computedTable = generateComputedTable({
      currentHp: 34,
      auraChecked: false,
      blindChecked: false,
      silenceChecked: false,
      slowChecked: false,
      maxHp: 9576,
      category,
      deadCharacters: 0,
      spellTable,
    });
    expect(
      computeManip(
        currentTable,
        currentCrisis,
        rng,
        category,
        computedTable,
        spellOrder,
        "Arkange (1)"
      )
    ).toEqual({ doOver1: 2, skipTurn: 3, doOver2: 27 });
  });

  // reactivate later : optimize manip
  it("should compute manip for 100% rng 116 for arkange with 34 hp", async () => {
    let category = "100%";
    let currentCrisis = 1;
    let currentTable = 3;
    let rng = 116;
    let spellOrder = 2;
    let computedTable = generateComputedTable({
      currentHp: 34,
      auraChecked: false,
      blindChecked: false,
      silenceChecked: false,
      slowChecked: false,
      maxHp: 9576,
      category,
      deadCharacters: 0,
      spellTable,
    });
    expect(
      computeManip(
        currentTable,
        currentCrisis,
        rng,
        category,
        computedTable,
        spellOrder,
        "Arkange (1)"
      )
    ).toEqual({ doOver1: 5, skipTurn: 3, doOver2: 48 });
  });

  it("should compute manip for 100% rng 130 for wall with 520 hp", async () => {
    let category = "100%";
    let currentCrisis = 4;
    let currentTable = 1;
    let rng = 130;
    let spellOrder = 1;
    let computedTable = generateComputedTable({
      currentHp: 520,
      auraChecked: false,
      blindChecked: false,
      silenceChecked: false,
      slowChecked: false,
      maxHp: 9576,
      category,
      deadCharacters: 0,
      spellTable,
    });
    expect(
      computeManip(
        currentTable,
        currentCrisis,
        rng,
        category,
        computedTable,
        spellOrder,
        "Arkange (1)"
      )
    ).toEqual({ doOver1: 8, skipTurn: 9, doOver2: 41 });
  });

  it("should compute manip for 100% rng 78 for wall with 520 hp with aura", async () => {
    let category = "100%";
    let currentCrisis = 4;
    let currentTable = 1;
    let rng = 78;
    let spellOrder = 2;
    let computedTable = generateComputedTable({
      currentHp: 520,
      auraChecked: true,
      blindChecked: false,
      silenceChecked: false,
      slowChecked: false,
      maxHp: 9576,
      category,
      deadCharacters: 0,
      spellTable,
    });
    expect(
      computeManip(
        currentTable,
        currentCrisis,
        rng,
        category,
        computedTable,
        spellOrder,
        "Wall (1)"
      )
    ).toEqual({ doOver1: 0, skipTurn: 6, doOver2: 4 });
  });

  it("should compute manip for 100% rng 157 for wall with 520 hp", async () => {
    let category = "100%";
    let currentCrisis = 4;
    let currentTable = 2;
    let rng = 157;
    let spellOrder = 1;
    let computedTable = generateComputedTable({
      currentHp: 520,
      auraChecked: false,
      blindChecked: false,
      silenceChecked: false,
      slowChecked: false,
      maxHp: 9576,
      category,
      deadCharacters: 0,
      spellTable,
    });
    expect(
      computeManip(
        currentTable,
        currentCrisis,
        rng,
        category,
        computedTable,
        spellOrder,
        "Wall (1)"
      )
    ).toEqual({ doOver1: 0, skipTurn: 3, doOver2: 9 });
  });

  it("should compute manip for 100% rng 67 for Arkange with 520 hp", async () => {
    let category = "100%";
    let currentCrisis = 3;
    let currentTable = 4;
    let rng = 67;
    let spellOrder = 2;
    let computedTable = generateComputedTable({
      currentHp: 520,
      auraChecked: false,
      blindChecked: false,
      silenceChecked: false,
      slowChecked: false,
      maxHp: 9576,
      category,
      deadCharacters: 0,
      spellTable,
    });
    expect(
      computeManip(
        currentTable,
        currentCrisis,
        rng,
        category,
        computedTable,
        spellOrder,
        "Arkange (1)"
      )
    ).toEqual({ fastDoOver: 3 });
  });

  it("should compute manip for 100% rng 160 for joobu with 520 hp", async () => {
    let category = "100%";
    let currentCrisis = 3;
    let currentTable = 3;
    let rng = 160;
    let spellOrder = 1;
    let computedTable = generateComputedTable({
      currentHp: 520,
      auraChecked: false,
      blindChecked: false,
      silenceChecked: false,
      slowChecked: false,
      maxHp: 9576,
      category,
      deadCharacters: 0,
      spellTable,
    });
    expect(
      computeManip(
        currentTable,
        currentCrisis,
        rng,
        category,
        computedTable,
        spellOrder,
        "Joobu (1)"
      )
    ).toEqual({ doOver1: 1, skipTurn: 9, doOver2: 0 });
  });

  it("should compute manip for 100% rng 160 for wall with 520 hp", async () => {
    let category = "100%";
    let currentCrisis = 3;
    let currentTable = 3;
    let rng = 160;
    let spellOrder = 1;
    let computedTable = generateComputedTable({
      currentHp: 520,
      auraChecked: false,
      blindChecked: false,
      silenceChecked: false,
      slowChecked: false,
      maxHp: 9576,
      category,
      deadCharacters: 0,
      spellTable,
    });
    expect(
      computeManip(
        currentTable,
        currentCrisis,
        rng,
        category,
        computedTable,
        spellOrder,
        "Wall (1)"
      )
    ).toEqual({ doOver1: 2, skipTurn: 3, doOver2: 10 });
  });

  it("should compute manip for 100% rng 157 for wall with 520 hp", async () => {
    let category = "100%";
    let currentCrisis = 1;
    let currentTable = 2;
    let rng = 105;
    let spellOrder = 2;
    let computedTable = generateComputedTable({
      currentHp: 520,
      auraChecked: false,
      blindChecked: false,
      silenceChecked: false,
      slowChecked: false,
      maxHp: 9576,
      category,
      deadCharacters: 0,
      spellTable,
    });
    expect(
      computeManip(
        currentTable,
        currentCrisis,
        rng,
        category,
        computedTable,
        spellOrder,
        "Joobu (1)"
      )
    ).toEqual({ doOver1: 1, skipTurn: 3, doOver2: 1 });
  });
});

describe("getTranslatedSpell", () => {
  it("should return the translation for a spell", () => {
    expect(getTranslatedSpell("Arkange (1)", "FR")).toEqual("Arkange (1)");
    expect(getTranslatedSpell("Arkange (1)", "JP")).toEqual("レビテガ (1)");
    expect(getTranslatedSpell("The End (1)", "JP")).toEqual("ジエンド (1)");
    expect(getTranslatedSpell("Wall (1)", "JP")).toEqual("ウォール (1)");
  });
});

describe("generateComputedTable", () => {
  it("should generate a valid computed table", () => {
    let computedTable = generateComputedTable({
      currentHp: 34,
      auraChecked: false,
      blindChecked: false,
      silenceChecked: false,
      slowChecked: false,
      maxHp: 482,
      category: "100%",
      deadCharacters: 0,
      spellTable,
    });

    const filteredComputedTable = filterComputedTable(computedTable, []);

    expect(filteredComputedTable[0]).toEqual({
      current_crisis_level: 1,
      entry: 3,
      random_mod: 99,
      rng: 1,
      spell_name1: "Soin (1)",
      spell_name2: "Aura (2)",
      spell_name3: "Brasier (2)",
      spell_name4: "Glacier + (1)",
      table: 2,
    });
  });
});
