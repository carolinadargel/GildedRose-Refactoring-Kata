import { getItemCategory } from './item-category';
import { updateItemByCategory } from './item-updater';
import { decreaseSellIn } from './quality-rules';

export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name: string, sellIn: number, quality: number) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  // Iterate through all items in the inventory and update their quality and sellIn
  // according to the rules defined for each category of item
  updateQuality(): Array<Item> {
    for (const item of this.items) {
      this.updateItem(item);
    }

    return this.items;
  }

  // Route each item to the rule that applies to it.
  private updateItem(item: Item): void {
    const category = getItemCategory(item.name);
    const shouldDecreaseSellIn = updateItemByCategory(item, category);

    if (shouldDecreaseSellIn) {
      decreaseSellIn(item, 1);
    }
  }
}
