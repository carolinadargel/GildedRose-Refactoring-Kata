import { Item, GildedRose } from '@/gilded-rose';

describe('Gilded Rose', () => {
  it('degrades normal items by 1 before the sell date', () => {
    const items = [new Item('Elixir of the Mongoose', 5, 7)];

    new GildedRose(items).updateQuality();

    expect(items[0]).toEqual(new Item('Elixir of the Mongoose', 4, 6));
  });

  it('degrades normal items twice as fast after the sell date', () => {
    const items = [new Item('+5 Dexterity Vest', 0, 10)];

    new GildedRose(items).updateQuality();

    expect(items[0]).toEqual(new Item('+5 Dexterity Vest', 0, 8));
  });

  it('increases aged brie quality over time', () => {
    const items = [new Item('Aged Brie', 2, 0)];

    new GildedRose(items).updateQuality();

    expect(items[0]).toEqual(new Item('Aged Brie', 1, 1));
  });

  it('increases aged brie twice as fast after the sell date', () => {
    const items = [new Item('Aged Brie', 0, 10)];

    new GildedRose(items).updateQuality();

    expect(items[0]).toEqual(new Item('Aged Brie', 0, 12));
  });

  it('drops backstage passes quality to zero after the concert', () => {
    const items = [new Item('Backstage passes to a TAFKAL80ETC concert', 0, 20)];

    new GildedRose(items).updateQuality();

    expect(items[0]).toEqual(new Item('Backstage passes to a TAFKAL80ETC concert', 0, 0));
  });

  it('increases backstage passes quality faster near the concert', () => {
    const items = [new Item('Backstage passes to a TAFKAL80ETC concert', 5, 40)];

    new GildedRose(items).updateQuality();

    expect(items[0]).toEqual(new Item('Backstage passes to a TAFKAL80ETC concert', 4, 43));
  });

  it('never changes sulfuras', () => {
    const items = [new Item('Sulfuras, Hand of Ragnaros', 0, 80)];

    new GildedRose(items).updateQuality();

    expect(items[0]).toEqual(new Item('Sulfuras, Hand of Ragnaros', 0, 80));
  });

  it('degrades conjured items twice as fast as normal items', () => {
    const items = [new Item('Conjured Mana Cake', 3, 6)];

    new GildedRose(items).updateQuality();

    expect(items[0]).toEqual(new Item('Conjured Mana Cake', 2, 4));
  });

  it('degrades conjured items four points after the sell date', () => {
    const items = [new Item('Conjured Mana Cake', 0, 6)];

    new GildedRose(items).updateQuality();

    expect(items[0]).toEqual(new Item('Conjured Mana Cake', 0, 2));
  });

  it('never lets quality go below zero', () => {
    const items = [new Item('Conjured Mana Cake', 0, 3)];

    new GildedRose(items).updateQuality();

    expect(items[0]).toEqual(new Item('Conjured Mana Cake', 0, 0));
  });

  it('never lets sellIn go below zero', () => {
    const items = [new Item('Elixir of the Mongoose', 0, 7)];

    new GildedRose(items).updateQuality();

    expect(items[0]).toEqual(new Item('Elixir of the Mongoose', 0, 5));
  });

  it('never lets non-legendary quality go above fifty', () => {
    const items = [
      new Item('Aged Brie', 5, 50),
      new Item('Backstage passes to a TAFKAL80ETC concert', 5, 49),
    ];

    new GildedRose(items).updateQuality();

    expect(items[0]).toEqual(new Item('Aged Brie', 4, 50));
    expect(items[1]).toEqual(new Item('Backstage passes to a TAFKAL80ETC concert', 4, 50));
  });
});
