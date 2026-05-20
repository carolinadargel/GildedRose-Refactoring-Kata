import type { Item } from './gilded-rose';
import type { ItemCategory } from './item-category';
import {
  decreaseQuality,
  increaseQuality,
  resetQuality,
} from './quality-rules';

// Logic for updating the quality and sellIn of items in the inventory according
// to the rules defined for each category of item
// The main function is updateItemByCategory, which takes an item and its category
// and applies the appropriate rules to update the item's quality and sellIn.

export function updateItemByCategory(item: Item, category: ItemCategory): boolean {
  if (category === 'aged-brie') {
    updateAgedBrie(item);
    return true;
  }

  if (category === 'backstage') {
    updateBackstagePasses(item);
    return true;
  }

  if (category === 'conjured') {
    updateDegradingItem(item, 2);
    return true;
  }

  if (category === 'normal') {
    updateDegradingItem(item, 1);
    return true;
  }

  return false;
}

function updateDegradingItem(item: Item, rate: number): void {
  decreaseQuality(item, rate);

  if (item.sellIn <= 0) {
    decreaseQuality(item, rate);
  }
}

function updateAgedBrie(item: Item): void {
  increaseQuality(item, 1);

  if (item.sellIn <= 0) {
    increaseQuality(item, 1);
  }
}

function updateBackstagePasses(item: Item): void {
  if (item.sellIn <= 0) {
    resetQuality(item);
    return;
  }

  increaseQuality(item, 1);

  if (item.sellIn <= 10) {
    increaseQuality(item, 1);
  }

  if (item.sellIn <= 5) {
    increaseQuality(item, 1);
  }
}
