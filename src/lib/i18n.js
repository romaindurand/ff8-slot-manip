import spells from "../data/spells.json";
import spellTable from "../data/table.json";

const langIndex = ["FR", "EN", "JP"];
export function getSpells(lang) {
  const translatedSpells = spellTable.map((table) =>
    table.map((crisis) =>
      crisis.map((spellNameFR) => {
        return getTranslatedSpell(spellNameFR, lang);
      })
    )
  );

  return translatedSpells;
}

export function getTranslatedSpell(spellNameFR, lang) {
  const spellNameRoot = spellNameFR.split(" (")[0];
  const spellLevel = spellNameFR.split(" (")[1].replace(")", "");
  const spellIndex = spells.findIndex(
    (spellsTrad) => spellNameRoot === spellsTrad[0]
  );
  const translatedSpell = spells[spellIndex][langIndex.indexOf(lang)];
  return `${translatedSpell} (${spellLevel})`;
}
