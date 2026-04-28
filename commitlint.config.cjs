// Commitlint avec preset Conventional Commits, calé sur les types
// déjà documentés dans CONTRIBUTING.md (feat / fix / docs / refactor /
// perf / test / chore / ci / style / build / revert).
//
// Le preset @commitlint/config-conventional couvre déjà ces types avec
// les règles standards (sujet en minuscule, longueur max, etc.). On
// reste sur le défaut pour ne pas diverger d'une convention que les
// outils tiers (Changesets, Dependabot, GitHub) reconnaissent
// nativement.
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
