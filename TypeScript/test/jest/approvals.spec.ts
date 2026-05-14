import { Item, GildedRose } from '@/gilded-rose';

describe('Gilded Rose daily flow', () => {
  it('updates a mixed inventory in one pass', () => {
    const items = [
      new Item('+5 Dexterity Vest', 10, 20),
      new Item('Aged Brie', 2, 0),
      new Item('Sulfuras, Hand of Ragnaros', 0, 80),
      new Item('Backstage passes to a TAFKAL80ETC concert', 10, 49),
      new Item('Conjured Mana Cake', 3, 6),
    ];

    new GildedRose(items).updateQuality();

    expect(items).toEqual([
      new Item('+5 Dexterity Vest', 9, 19),
      new Item('Aged Brie', 1, 1),
      new Item('Sulfuras, Hand of Ragnaros', 0, 80),
      new Item('Backstage passes to a TAFKAL80ETC concert', 9, 50),
      new Item('Conjured Mana Cake', 2, 4),
    ]);
  });
});
