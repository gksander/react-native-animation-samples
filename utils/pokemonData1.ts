export type PokeDetail = {
  name: string;
  number: number;
  description: string;
  darkVibrant: string;
  lightMuted: string;
  image: any;
};

export const pokemonData1: PokeDetail[] = [
  {
    name: "Bulbasaur",
    number: 1,
    description: `A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.`,
    darkVibrant: `rgb(10, 92, 84)`,
    lightMuted: `rgb(124, 188, 179)`,
    image: require("../views/PokemonSlider/img/bulbasaur.png"),
  },
  {
    name: "Ivysaur",
    number: 2,
    description: `When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.`,
    darkVibrant: `rgb(4, 132, 52)`,
    lightMuted: `rgb(164, 148, 172)`,
    image: require("../views/PokemonSlider/img/ivysaur.png"),
  },
  {
    name: "Venasaur",
    number: 3,
    description: `The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.`,
    darkVibrant: `rgb(5, 121, 49)`,
    lightMuted: `rgb(180, 164, 180)`,
    image: require("../views/PokemonSlider/img/venasaur.png"),
  },
  {
    name: "Charmander",
    number: 4,
    description: `Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`,
    darkVibrant: `rgb(137, 84, 17)`,
    lightMuted: `rgb(183, 177, 128)`,
    image: require("../views/PokemonSlider/img/charmander.png"),
  },
  {
    name: "Charmeleon",
    number: 5,
    description: `When it swings its burning tail, it elevates the temperature to unbearably high levels.`,
    darkVibrant: `rgb(139, 8, 28)`,
    lightMuted: `rgb(210, 201, 161)`,
    image: require("../views/PokemonSlider/img/charmeleon.png"),
  },
  {
    name: "Charizard",
    number: 6,
    description: `Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.`,
    darkVibrant: `rgb(4, 132, 132)`,
    lightMuted: `rgb(135.7, 126.4, 17.3)`,
    image: require("../views/PokemonSlider/img/charizard.png"),
  },
  {
    name: "Squirtle",
    number: 7,
    description: `After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.`,
    darkVibrant: `rgb(169, 82, 6)`,
    lightMuted: `rgb(129, 196, 188)`,
    image: require("../views/PokemonSlider/img/squirtle.png"),
  },
  {
    name: "Wartortle",
    number: 8,
    description: `Often hides in water to stalk unwary prey. For swimming fast, it moves its ears to maintain balance.`,
    darkVibrant: `rgb(167, 62, 4)`,
    lightMuted: `rgb(162, 192, 213)`,
    image: require("../views/PokemonSlider/img/wartortle.png"),
  },
  {
    name: "Blastoise",
    number: 9,
    description: `A brutal POKéMON with pressurized water jets on its shell. They are used for high speed tackles.`,
    darkVibrant: `rgb(34, 89, 122)`,
    lightMuted: `rgb(202, 195, 142)`,
    image: require("../views/PokemonSlider/img/blastoise.png"),
  },
  {
    name: "Pikachu",
    number: 25,
    description: `When several of these POKéMON gather, their electricity could build and cause lightning storms.`,
    darkVibrant: `rgb(124, 116, 12)`,
    lightMuted: `rgb(150.6, 135.6, 2.4)`,
    image: require("../views/PokemonSlider/img/pikachu.png"),
  },
  {
    name: "Jigglypuff",
    number: 39,
    description: `When its huge eyes light up, it sings a mysteriously soothing melody that lulls its enemies to sleep.`,
    darkVibrant: `rgb(44, 132, 124)`,
    lightMuted: `rgb(212, 172, 192)`,
    image: require("../views/PokemonSlider/img/jigglypuff.png"),
  },
  {
    name: "Snorlax",
    number: 143,
    description: `Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes steadily more slothful.`,
    darkVibrant: `rgb(4, 108, 108)`,
    lightMuted: `rgb(202, 189, 160)`,
    image: require("../views/PokemonSlider/img/snorlax.png"),
  },
  {
    name: "Mewtwo",
    number: 150,
    description: `It was created by a scientist after years of horrific gene splicing and DNA engineering experiments.`,
    darkVibrant: `rgb(84.2, 48.4, 83.1)`,
    lightMuted: `rgb(209, 175, 208)`,
    image: require("../views/PokemonSlider/img/mewtwo.png"),
  },
];
