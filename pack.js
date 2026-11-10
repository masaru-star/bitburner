/** @param {NS} ns */
export async function main(ns) {
  await ns.wget("https://bn.masarulab.com/menu/nuke.js", "root.js");
  await ns.wget("https://bn.masarulab.com/menu/scan.js", "find.js");
  await ns.wget("https://bn.masarulab.com/Terminal/xp-farm.js", "xp-farm.js");
  await ns.wget("https://bn.masarulab.com/Terminal/hack.js", "money.js");  
}
