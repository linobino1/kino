import type { Page } from '@/payload-types'

type Result = Pick<Page, 'blocks' | 'hero'>

export const migrateBlocks = (incomingBlocks: any): Result => {
  // console.log('incomingBlocks', JSON.stringify(incomingBlocks, null, 2))
  // set up initial values
  let blocks: any = [...(incomingBlocks ?? [])]
  const hero: Page['hero'] = {
    type: 'none',
  }

  // if the the first block is a 'headerImage' block, set the hero type to 'image'
  if (blocks?.[0]?.blockType === 'headerImage') {
    hero.type = 'image'
    hero.image = blocks[0].image
    blocks.shift()

    // if the second block is a 'heading' block, add the headline to the hero
    if (blocks?.[0]?.blockType === 'heading') {
      hero.headline = blocks[0].text
      blocks.shift()
    }
  } else {
    // if the first block is a 'heading' block, set the hero type to 'headline'
    if (blocks?.[0]?.blockType === 'heading') {
      hero.type = 'headline'
      hero.headline = blocks[0].text ?? ' '
      blocks.shift()
    }
  }

  // remove 'outlet' blocks from the layout
  blocks = blocks.filter((block: any) => block.blockType !== 'outlet')

  // console.log('result', JSON.stringify({ blocks, hero }, null, 2))

  return {
    blocks,
    hero,
  }
}
