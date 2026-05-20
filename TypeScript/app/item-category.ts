export const AGED_BRIE = 'Aged Brie';
export const BACKSTAGE_PASSES = 'Backstage passes to a TAFKAL80ETC concert';
export const SULFURAS = 'Sulfuras, Hand of Ragnaros';
export const CONJURED_PREFIX = 'Conjured';

export type ItemCategory =
  | 'normal'
  | 'aged-brie'
  | 'backstage'
  | 'sulfuras'
  | 'conjured';

// Determine the category of an item based on its name.
// This is used to determine which rules apply to the item.
export function getItemCategory(itemName: string): ItemCategory {
  if (itemName === AGED_BRIE) {
    return 'aged-brie';
  }

  if (itemName === BACKSTAGE_PASSES) {
    return 'backstage';
  }

  if (itemName === SULFURAS) {
    return 'sulfuras';
  }

  if (itemName.indexOf(CONJURED_PREFIX) === 0) {
    return 'conjured';
  }

  return 'normal';
}
