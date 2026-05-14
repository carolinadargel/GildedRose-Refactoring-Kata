import type { Item } from './gilded-rose';

const MIN_QUALITY = 0;
const MAX_QUALITY = 50;

export function increaseQuality(item: Item, amount: number): void {
  item.quality = Math.min(MAX_QUALITY, item.quality + amount);
}

export function decreaseQuality(item: Item, amount: number): void {
  item.quality = Math.max(MIN_QUALITY, item.quality - amount);
}

export function decreaseSellIn(item: Item, amount: number): void {
  item.sellIn = Math.max(0, item.sellIn - amount);
}

export function resetQuality(item: Item): void {
  item.quality = MIN_QUALITY;
}
