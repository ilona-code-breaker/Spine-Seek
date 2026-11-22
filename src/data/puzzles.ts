import { DifficultyTier, Puzzle } from '../types/game';

export interface TierStyle {
  label: string;
  roman: string;
  description: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  swatchHex: string;
  emoji: string;
}

export const TIER_META: Record<DifficultyTier, TierStyle> = {
  yellow: {
    label: 'Yellow',
    roman: 'I',
    description: 'Straightforward',
    bgClass: 'bg-[#E9C46A]',
    borderClass: 'border-[#D9B152]',
    textClass: 'text-[#1A1714]',
    swatchHex: '#E9C46A',
    emoji: '🟨',
  },
  green: {
    label: 'Green',
    roman: 'II',
    description: 'Literary & Thematic',
    bgClass: 'bg-[#9BB89E]',
    borderClass: 'border-[#86A589]',
    textClass: 'text-[#162017]',
    swatchHex: '#9BB89E',
    emoji: '🟩',
  },
  blue: {
    label: 'Blue',
    roman: 'III',
    description: 'Deep Cut',
    bgClass: 'bg-[#94B0CC]',
    borderClass: 'border-[#7E9DBA]',
    textClass: 'text-[#141D26]',
    swatchHex: '#94B0CC',
    emoji: '🟦',
  },
  purple: {
    label: 'Purple',
    roman: 'IV',
    description: 'Wordplay & Tricky',
    bgClass: 'bg-[#C4A4C9]',
    borderClass: 'border-[#B08EB6]',
    textClass: 'text-[#211524]',
    swatchHex: '#C4A4C9',
    emoji: '🟪',
  },
};

export const TIER_ORDER: DifficultyTier[] = ['yellow', 'green', 'blue', 'purple'];

/**
 * Editable array of book-themed Connections puzzles.
 * Each puzzle must contain 4 groups of 4 unique uppercase tile strings (16 total).
 */
export const PUZZLES: Puzzle[] = [
  {
    id: 'edition-01',
    editionNumber: 1,
    title: 'Reading Habits & Trope Traps',
    groups: [
      {
        id: 'p1-yellow',
        tier: 'yellow',
        category: 'Things You Do While Reading',
        items: [
          'DOG-EAR A PAGE',
          'HIGHLIGHT A LINE',
          'USE A RECEIPT',
          'BOOKMARK YOUR PLACE',
        ],
      },
      {
        id: 'p1-green',
        tier: 'green',
        category: 'Classic Romantasy Tropes',
        items: [
          'FORCED PROXIMITY',
          'ENEMIES TO LOVERS',
          'FAKE DATING',
          'ONLY ONE BED',
        ],
      },
      {
        id: 'p1-blue',
        tier: 'blue',
        category: 'Words That Also Mean "Chapter" or "Section"',
        items: ['PART', 'ACT', 'VOLUME', 'CANTO'],
      },
      {
        id: 'p1-purple',
        tier: 'purple',
        category: 'Words Before "____ Club"',
        items: ['BOOK', 'SUPPER', 'FIGHT', 'BREAKFAST'],
      },
    ],
  },
  {
    id: 'edition-02',
    editionNumber: 2,
    title: 'Pages, Paper & Plot',
    groups: [
      {
        id: 'p2-yellow',
        tier: 'yellow',
        category: 'Parts of a Physical Book',
        items: ['SPINE', 'COVER', 'FLAP', 'ENDPAPER'],
      },
      {
        id: 'p2-green',
        tier: 'green',
        category: 'Literary Devices',
        items: ['FORESHADOWING', 'ALLEGORY', 'MOTIF', 'FLASHBACK'],
      },
      {
        id: 'p2-blue',
        tier: 'blue',
        category: 'Famous Fictional Libraries & Archives',
        items: ['CITADEL', 'ALEXANDRIA', 'HOGWARTS', 'BABEL'],
      },
      {
        id: 'p2-purple',
        tier: 'purple',
        category: '"____ Reader" Compound Terms',
        items: ['KINDLE', 'BETA', 'PROOF', 'MIND'],
      },
    ],
  },
  {
    id: 'edition-03',
    editionNumber: 3,
    title: 'Shelves & Stories',
    groups: [
      {
        id: 'p3-yellow',
        tier: 'yellow',
        category: 'Popular Literary Genres',
        items: ['THRILLER', 'MEMOIR', 'FANTASY', 'WESTERN'],
      },
      {
        id: 'p3-green',
        tier: 'green',
        category: 'Things That Happen to Your TBR List',
        items: [
          'GROWS DAILY',
          'IGNORES MOOD',
          'GETS REORDERED',
          'COLLECTS DUST',
        ],
      },
      {
        id: 'p3-blue',
        tier: 'blue',
        category: 'Famous Fictional Detectives',
        items: ['HOLMES', 'POIROT', 'MARPLE', 'SPADE'],
      },
      {
        id: 'p3-purple',
        tier: 'purple',
        category: 'Words After "Paper ____"',
        items: ['BACK', 'CUT', 'WEIGHT', 'TRAIL'],
      },
    ],
  },
  {
    id: 'edition-04',
    editionNumber: 4,
    title: 'Ink & Ending',
    groups: [
      {
        id: 'p4-yellow',
        tier: 'yellow',
        category: 'Reading Formats & Editions',
        items: ['HARDCOVER', 'EBOOK', 'AUDIOBOOK', 'PAPERBACK'],
      },
      {
        id: 'p4-green',
        tier: 'green',
        category: 'Classic Opening Lines',
        items: [
          'ONCE UPON A TIME',
          'IT WAS A DARK AND STORMY NIGHT',
          'CALL ME ISHMAEL',
          'IN THE BEGINNING',
        ],
      },
      {
        id: 'p4-blue',
        tier: 'blue',
        category: 'Publishing & Editing Roles',
        items: ['AGENT', 'PUBLICIST', 'TYPESETTER', 'COPYEDITOR'],
      },
      {
        id: 'p4-purple',
        tier: 'purple',
        category: 'Things You Can "Turn" That Aren\'t Pages',
        items: ['A CORNER', 'THE TABLES', 'A BLIND EYE', 'PRO'],
      },
    ],
  },
  {
    id: 'edition-05',
    editionNumber: 5,
    title: 'Shelf Life',
    groups: [
      {
        id: 'p5-yellow',
        tier: 'yellow',
        category: 'Bookshop & Library Vibes',
        items: [
          'QUIET AISLES',
          'WOODEN SHELVES',
          'COFFEE SMELL',
          'STAMPED DUE DATE',
        ],
      },
      {
        id: 'p5-green',
        tier: 'green',
        category: 'Types of Endings',
        items: [
          'CLIFFHANGER',
          'HAPPY EVER AFTER',
          'BITTERSWEET',
          'OPEN-ENDED',
        ],
      },
      {
        id: 'p5-blue',
        tier: 'blue',
        category: 'Words That Follow "Plot ____"',
        items: ['TWIST', 'HOLE', 'ARMOR', 'DEVICE'],
      },
      {
        id: 'p5-purple',
        tier: 'purple',
        category: 'Words Before "Shelf"',
        items: ['BOOK', 'TOP', 'LIFE', 'DRY'],
      },
    ],
  },
  {
    id: 'edition-06',
    editionNumber: 6,
    title: 'Character Arcs',
    groups: [
      {
        id: 'p6-yellow',
        tier: 'yellow',
        category: 'Character Archetypes',
        items: ['MENTOR', 'TRICKSTER', 'ANTIHERO', 'SIDEKICK'],
      },
      {
        id: 'p6-green',
        tier: 'green',
        category: 'Post-Book Hangover Symptoms',
        items: [
          'EMPTY CHEST',
          'LOST SENSE OF TIME',
          'RE-READING FAVORITE SCENES',
          'STARING AT WALL',
        ],
      },
      {
        id: 'p6-blue',
        tier: 'blue',
        category: 'Famous Fictional Schools & Academies',
        items: [
          'BRAKEBILLS',
          'CAMP HALF-BLOOD',
          'UNSEEN UNIVERSITY',
          'HOGWARTS',
        ],
      },
      {
        id: 'p6-purple',
        tier: 'purple',
        category: 'Words Before "Novel"',
        items: ['GRAPHIC', 'VISUAL', 'CRIME', 'DEBUT'],
      },
    ],
  },
  {
    id: 'edition-07',
    editionNumber: 7,
    title: 'Print & Prose',
    groups: [
      {
        id: 'p7-yellow',
        tier: 'yellow',
        category: 'Punctuation Marks',
        items: ['SEMICOLON', 'ELLIPSIS', 'EM DASH', 'PARENTHESIS'],
      },
      {
        id: 'p7-green',
        tier: 'green',
        category: 'Things Found on a Book Cover',
        items: ['BLURB', 'BARCODE', 'TITLE', 'AUTHOR NAME'],
      },
      {
        id: 'p7-blue',
        tier: 'blue',
        category: 'Literary Movements & Styles',
        items: ['REALISM', 'ROMANTICISM', 'MODERNISM', 'GOTHIC'],
      },
      {
        id: 'p7-purple',
        tier: 'purple',
        category: 'Things You "Check Out" That Aren\'t Library Books',
        items: [
          'A HOTTIE',
          'YOUR BANK BALANCE',
          'A HOTEL ROOM',
          'THE SCENE',
        ],
      },
    ],
  },
  {
    id: 'edition-08',
    editionNumber: 8,
    title: 'Midnight Pages',
    groups: [
      {
        id: 'p8-yellow',
        tier: 'yellow',
        category: 'Late-Night Reading Excuses',
        items: [
          'JUST ONE MORE CHAPTER',
          'SHORT SECTION',
          'CLIFFHANGER ENDING',
          'TOMORROW IS WEEKEND',
        ],
      },
      {
        id: 'p8-green',
        tier: 'green',
        category: 'Fantasy Magic Systems & Elements',
        items: ['RUNES', 'POTIONS', 'SPELLS', 'CHARMS'],
      },
      {
        id: 'p8-blue',
        tier: 'blue',
        category: 'Words That Can Precede "Story"',
        items: ['BACK', 'COVER', 'BEDTIME', 'SHORT'],
      },
      {
        id: 'p8-purple',
        tier: 'purple',
        category: 'Words That Also Name a Type of Binding or Trim',
        items: ['SADDLE', 'SPIRAL', 'CASE', 'FRENCH'],
      },
    ],
  },
  {
    id: 'edition-09',
    editionNumber: 9,
    title: 'Famous Lines & Literary Worlds',
    groups: [
      {
        id: 'p9-yellow',
        tier: 'yellow',
        category: 'Ways a Reader Marks Favorite Quotes',
        items: [
          'STICKY TABS',
          'PENCIL MARGINALIA',
          'PHOTOGRAPHED PAGE',
          'BOOKMARK RIBBON',
        ],
      },
      {
        id: 'p9-green',
        tier: 'green',
        category: 'Famous Quotes From Beloved Novels',
        items: [
          'STAY GOLD PONYBOY',
          'NOT ALL WHO WANDER',
          'SO IT GOES',
          'WINTER IS COMING',
        ],
      },
      {
        id: 'p9-blue',
        tier: 'blue',
        category: 'Iconic Fictional Settings',
        items: ['PEMBERLEY', 'MANDERLEY', 'NARNIA', 'MIDDLE-EARTH'],
      },
      {
        id: 'p9-purple',
        tier: 'purple',
        category: 'Words That Follow "Book ____"',
        items: ['WORM', 'MARK', 'CASE', 'KEEPER'],
      },
    ],
  },
  {
    id: 'edition-10',
    editionNumber: 10,
    title: 'Dystopias & Heroines',
    groups: [
      {
        id: 'p10-yellow',
        tier: 'yellow',
        category: 'Bookstore Aisles',
        items: ['FICTION', 'POETRY', 'BIOGRAPHY', 'MYSTERY'],
      },
      {
        id: 'p10-green',
        tier: 'green',
        category: 'Famous Quotes From Dystopian Classics',
        items: [
          'BIG BROTHER IS WATCHING',
          'ALL ANIMALS ARE EQUAL',
          'IT WAS A PLEASURE TO BURN',
          'BLESSED BE THE FRUIT',
        ],
      },
      {
        id: 'p10-blue',
        tier: 'blue',
        category: 'Classic Austen & Brontë Heroines',
        items: [
          'ELIZABETH BENNET',
          'JANE EYRE',
          'EMMA WOODHOUSE',
          'CATHERINE EARNSHAW',
        ],
      },
      {
        id: 'p10-purple',
        tier: 'purple',
        category: 'Words After "Ghost ____"',
        items: ['WRITER', 'STORY', 'TOWN', 'SHIP'],
      },
    ],
  },
  {
    id: 'edition-11',
    editionNumber: 11,
    title: 'Down the Rabbit Hole',
    groups: [
      {
        id: 'p11-yellow',
        tier: 'yellow',
        category: 'Cozy Reading Nook Essentials',
        items: ['READING LAMP', 'KNIT THROW', 'EARL GREY', 'OTTOMAN'],
      },
      {
        id: 'p11-green',
        tier: 'green',
        category: "Memorable Quotes From Alice's Adventures in Wonderland",
        items: [
          'CURIOUSER AND CURIOUSER',
          'OFF WITH THEIR HEADS',
          "WE'RE ALL MAD HERE",
          'DOWN THE RABBIT HOLE',
        ],
      },
      {
        id: 'p11-blue',
        tier: 'blue',
        category: "Parts of a Book's Front Matter",
        items: ['DEDICATION', 'EPIGRAPH', 'FOREWORD', 'PROLOGUE'],
      },
      {
        id: 'p11-purple',
        tier: 'purple',
        category: 'Words Before "Tales"',
        items: ['CANTERBURY', 'FAIRY', 'FOLK', 'TALL'],
      },
    ],
  },
  {
    id: 'edition-12',
    editionNumber: 12,
    title: 'Opening Words & Honors',
    groups: [
      {
        id: 'p12-yellow',
        tier: 'yellow',
        category: "Classic Children's Book Icons",
        items: [
          'VELVETEEN RABBIT',
          'GOLDEN TICKET',
          'RED BALLOON',
          'GIVING TREE',
        ],
      },
      {
        id: 'p12-green',
        tier: 'green',
        category: 'Famous Opening Lines & Soliloquies',
        items: [
          'IT IS A TRUTH UNIVERSALLY ACKNOWLEDGED',
          'TO BE OR NOT TO BE',
          'ALL HAPPY FAMILIES ARE ALIKE',
          'IT WAS THE BEST OF TIMES',
        ],
      },
      {
        id: 'p12-blue',
        tier: 'blue',
        category: 'Major Literary Prizes',
        items: ['PULITZER', 'BOOKER', 'NOBEL', 'NEWBERY'],
      },
      {
        id: 'p12-purple',
        tier: 'purple',
        category: 'Words That Also Name a Book Format or Size',
        items: ['POCKET', 'QUARTO', 'FOLIO', 'DIGEST'],
      },
    ],
  },
  {
    id: 'edition-13',
    editionNumber: 13,
    title: 'Throne of Glass (Sarah J. Maas)',
    groups: [
      {
        id: 'p13-yellow',
        tier: 'yellow',
        category: 'Pet Names & Nicknames in Erilea',
        items: [
          'FIREHEART',
          'BUZZARD',
          'ELENTIYA',
          'FIRE-BREATHING BITCH-QUEEN',
        ],
      },
      {
        id: 'p13-green',
        tier: 'green',
        category: 'Magic Objects & Sacred Artifacts',
        items: ['EYE OF ELENA', 'WYRDKEYS', 'DAMARIS', 'WYRDSTONE COLLAR'],
      },
      {
        id: 'p13-blue',
        tier: 'blue',
        category: 'Major Villains & Antagonists',
        items: ['ERAWAN', 'MAEVE', 'AROBYNN HAMEL', 'CAIRN'],
      },
      {
        id: 'p13-purple',
        tier: 'purple',
        category: 'Iconic Quotes From the Series',
        items: [
          'YOU DO NOT YIELD',
          'TO WHATEVER END',
          'YOU COULD RATTLE THE STARS',
          'I AM AELIN ASHRYVER GALATHYNIUS AND I WILL NOT BE AFRAID',
        ],
      },
    ],
  },
];
