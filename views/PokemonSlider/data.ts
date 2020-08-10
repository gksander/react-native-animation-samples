export type PokeDetail = {
  name: string;
  number: number;
  description: string;
  image: any;
};

export const data: PokeDetail[] = [
  {
    name: "Bulbasaur",
    number: 1,
    description: `A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.`,
    image: require("./img/bulbasaur.png"),
  },
  {
    name: "Ivysaur",
    number: 2,
    description: `When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.`,
    image: require("./img/ivysaur.png"),
  },
  {
    name: "Venasaur",
    number: 3,
    description: `The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.`,
    image: require("./img/venasaur.png"),
  },
  {
    name: "Charmander",
    number: 4,
    description: `Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`,
    image: require("./img/charmander.png"),
  },
  {
    name: "Charmeleon",
    number: 5,
    description: `When it swings its burning tail, it elevates the temperature to unbearably high levels.`,
    image: require("./img/charmeleon.png"),
  },
  {
    name: "Charizard",
    number: 6,
    description: `Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.`,
    image: require("./img/charizard.png"),
  },
  {
    name: "Squirtle",
    number: 7,
    description: `After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.`,
    image: require("./img/squirtle.png"),
  },
  {
    name: "Wartortle",
    number: 8,
    description: `Often hides in water to stalk unwary prey. For swimming fast, it moves its ears to maintain balance.`,
    image: require("./img/wartortle.png"),
  },
  {
    name: "Blastoise",
    number: 9,
    description: `A brutal POKéMON with pressurized water jets on its shell. They are used for high speed tackles.`,
    image: require("./img/blastoise.png"),
  },
];
