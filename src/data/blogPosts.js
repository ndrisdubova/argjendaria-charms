const unsplash = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?fm=jpg&q=80&w=${w}&auto=format&fit=crop`

const blogPosts = [
  {
    id: 'b1',
    title: 'How to Choose the Right Diamond Cut',
    excerpt: 'From round brilliant to emerald cut, here is how each shape catches the light differently.',
    content: `Choosing a diamond cut is about more than shape — it determines how a stone plays with light. Round brilliants offer maximum sparkle thanks to their symmetrical facets, while emerald cuts favor clarity and a more understated, architectural elegance.\n\nWhen you visit our atelier, we'll walk you through each cut in person under different lighting so you can see exactly how it will look day to day, not just under a jeweler's loupe.`,
    image: unsplash('photo-1611591437281-460bfbe1220a'),
    author: "Charm's Atelier",
    date: '2026-05-12T09:00:00.000Z',
  },
  {
    id: 'b2',
    title: 'Caring for Your Gold Jewelry at Home',
    excerpt: 'Simple habits that keep your pieces looking as radiant as the day you got them.',
    content: `Gold is durable, but it still deserves a little care. Store pieces separately to avoid scratching, remove jewelry before swimming or applying lotion, and give it an occasional gentle clean with warm water and a soft brush.\n\nFor anything set with delicate stones like pearls or opals, avoid ultrasonic cleaners — bring it by the atelier instead and we'll take care of it for you, free of charge.`,
    image: unsplash('photo-1515562141207-7a88fb7ce338'),
    author: "Charm's Atelier",
    date: '2026-04-02T09:00:00.000Z',
  },
  {
    id: 'b3',
    title: 'Behind the Scenes: From Wax to Polish',
    excerpt: 'A look inside our atelier at the hand-finishing process behind every piece.',
    content: `Every Charm's piece begins as a hand-carved wax model before it's cast, set, and polished entirely by hand. It's a slower process than mass production, but it's the only way we know to guarantee the kind of detail that lasts for generations.\n\nWe're planning an open atelier day this year for clients who'd like to see the workshop in person — stay tuned to this page for the date.`,
    image: unsplash('photo-1573408301185-9146fe634ad0'),
    author: "Charm's Atelier",
    date: '2026-02-18T09:00:00.000Z',
  },
]

export default blogPosts
