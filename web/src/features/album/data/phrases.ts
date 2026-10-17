import { shuffled } from '@/lib/shuffle'

/** Shown one at a time under the name. The first one opens the page; the rest follow in random order. */
export const OPENING_PHRASE = 'Fly high, kaucrow.'

export const PHRASES: readonly string[] = [
  OPENING_PHRASE,
  // The crab
  'Compiled without warnings.',
  'cargo run forever.',
  'Memory-safe in all of ours.',
  'No borrow checker could hold onto you.',
  'Zero-cost memories.',
  'You never panicked, and unwrap() never failed you.',
  'Ok(Javier) in every thread.',
  'Fearless, like the language.',
  'impl Friend for Javier',
  'Ownership transferred to all of us.',
  // His dotfiles
  'Thanks for the rice.',
  'Still in everyone’s PATH.',
  'git commit -m "forever"',
  'Rice well, rest well.',
  'sudo couldn’t make us miss you less.',
  'Your config lives on in ours.',
  'Symlinked to our hearts.',
  'Uptime: unforgettable.',
  'Pinned, like the best version of everything.',
  'I use Arch, btw, and I’ll miss him btw.',
  // The crow
  'A crow never really leaves the sky.',
  'Caw. We heard you.',
  'Perched somewhere with better wifi.',
  'Fly high, kaucrow. Mind the latency.',
  // Plainer and warm
  'Gone from the terminal, never from the chat.',
  'Your commits stay in our history.',
  'Merged into everything we do.',
  'Out of office, still in the team.',
  'Thanks for every pull request, every laugh, every night.',
  'You left good code and better memories.',
]

/** The opening phrase first, then every other one once, in a random order. */
export function phraseOrder(random: () => number = Math.random): string[] {
  return [
    OPENING_PHRASE,
    ...shuffled(
      PHRASES.filter((p) => p !== OPENING_PHRASE),
      random,
    ),
  ]
}
