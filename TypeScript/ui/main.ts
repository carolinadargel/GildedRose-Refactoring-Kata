import { GildedRose, Item } from '../app/gilded-rose.js';
import { dictionaries, Language } from './dictionary.js';

type InventorySnapshot = {
  day: number;
  items: Array<Item>;
};

type SortOption =
  | 'item-asc'
  | 'item-desc'
  | 'sellIn-lowest'
  | 'sellIn-highest'
  | 'quality-lowest'
  | 'quality-highest'
  | 'criticality-lowest'
  | 'criticality-highest';

type ExpandedPanel = 'inventory' | 'timeline' | null;

const initialItems: Array<Item> = [
  new Item('+5 Dexterity Vest', 10, 20),
  new Item('Aged Brie', 2, 0),
  new Item('Elixir of the Mongoose', 5, 7),
  new Item('Sulfuras, Hand of Ragnaros', 0, 80),
  new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
  new Item('Backstage passes to a TAFKAL80ETC concert', 10, 49),
  new Item('Backstage passes to a TAFKAL80ETC concert', 5, 49),
  new Item('Conjured Mana Cake', 3, 6),
];

const dayBadge = getRequiredElement<HTMLElement>('[data-day]');
const summary = getRequiredElement<HTMLElement>('[data-summary]');
const inventoryBody = getRequiredElement<HTMLTableSectionElement>('[data-inventory]');
const historyList = getRequiredElement<HTMLOListElement>('[data-history]');
const nextDayButton = getRequiredElement<HTMLButtonElement>('[data-action="next-day"]');
const resetButton = getRequiredElement<HTMLButtonElement>('[data-action="reset"]');
const languageButton = getRequiredElement<HTMLButtonElement>('[data-action="toggle-language"]');
const sortSelect = getRequiredElement<HTMLSelectElement>('[data-sort]');
const layout = getRequiredElement<HTMLElement>('[data-layout]');
const inventoryPanel = getRequiredElement<HTMLElement>('[data-panel="inventory"]');
const timelinePanel = getRequiredElement<HTMLElement>('[data-panel="timeline"]');
const panelToggleButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>('[data-action="toggle-panel"]')
);
const heroEyebrow = getRequiredElement<HTMLElement>('[data-copy="hero-eyebrow"]');
const heroTitle = getRequiredElement<HTMLElement>('[data-copy="hero-title"]');
const inventoryTitle = getRequiredElement<HTMLElement>('[data-copy="inventory-title"]');
const timelineTitle = getRequiredElement<HTMLElement>('[data-copy="timeline-title"]');
const sortLabel = getRequiredElement<HTMLElement>('[data-copy="sort-label"]');
const highCriticalityMetricLabel = getRequiredElement<HTMLElement>('[data-copy="metric-high-criticality"]');
const averageQualityMetricLabel = getRequiredElement<HTMLElement>('[data-copy="metric-average-quality"]');
const expiredItemsMetricLabel = getRequiredElement<HTMLElement>('[data-copy="metric-expired-items"]');
const itemHeader = getRequiredElement<HTMLElement>('[data-copy="header-item"]');
const sellInHeader = getRequiredElement<HTMLElement>('[data-copy="header-sell-in"]');
const qualityHeader = getRequiredElement<HTMLElement>('[data-copy="header-quality"]');
const criticalityHeader = getRequiredElement<HTMLElement>('[data-copy="header-criticality"]');
const ruleHeader = getRequiredElement<HTMLElement>('[data-copy="header-rule"]');
const highCriticalityMetricValue = getRequiredElement<HTMLElement>('[data-metric="high-criticality"]');
const averageQualityMetricValue = getRequiredElement<HTMLElement>('[data-metric="average-quality"]');
const expiredItemsMetricValue = getRequiredElement<HTMLElement>('[data-metric="expired-items"]');

let history: Array<InventorySnapshot> = [];
let currentSort: SortOption = 'item-asc';
let currentLanguage: Language = 'en';
let selectedItemIndex: number | null = null;
let expandedPanel: ExpandedPanel = null;

applyStaticCopy();

function cloneItems(items: Array<Item>): Array<Item> {
  return items.map((item) => new Item(item.name, item.sellIn, item.quality));
}

function getRequiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error('UI element not found for selector: ' + selector);
  }

  return element;
}

function buildInitialHistory(): Array<InventorySnapshot> {
  return [
    {
      day: 0,
      items: cloneItems(initialItems),
    },
  ];
}

function advanceOneDay(): void {
  const currentSnapshot = history[history.length - 1];
  const currentItems = cloneItems(currentSnapshot.items);

  new GildedRose(currentItems).updateQuality();

  history = [
    ...history,
    {
      day: currentSnapshot.day + 1,
      items: cloneItems(currentItems),
    },
  ];

  render();
}

function resetSimulation(): void {
  history = buildInitialHistory();
  render();
}

function render(): void {
  const currentSnapshot = history[history.length - 1];
  const uiText = dictionaries[currentLanguage];

  dayBadge.textContent = uiText.dayLabel(currentSnapshot.day);
  summary.textContent =
    currentSnapshot.day === 0
      ? uiText.initialSummary
      : uiText.summaryForDay(currentSnapshot.day);

  updatePanelLayout();
  renderMetrics(currentSnapshot.items);
  renderInventory(currentSnapshot.items);
  renderHistory();
}

function renderMetrics(items: Array<Item>): void {
  const averageQuality = items.length === 0
    ? 0
    : Math.round((items.reduce((total, item) => total + item.quality, 0) / items.length) * 10) / 10;

  highCriticalityMetricValue.textContent = String(
    items.filter((item) => getCriticalityLevel(item) === 3).length
  );
  averageQualityMetricValue.textContent = String(averageQuality);
  expiredItemsMetricValue.textContent = String(
    items.filter((item) => item.sellIn === 0).length
  );
}

function renderInventory(items: Array<Item>): void {
  inventoryBody.innerHTML = '';
  const uiText = dictionaries[currentLanguage];

  for (const inventoryEntry of getSortedItems(items)) {
    const { item, index } = inventoryEntry;
    const row = document.createElement('tr');
    const criticality = getSaleCriticality(item);
    const isSelected = selectedItemIndex === index;

    row.className = isSelected ? 'inventory-row inventory-row-selected' : 'inventory-row';
    row.tabIndex = 0;

    row.innerHTML =
      '<td>' + escapeHtml(item.name) + '</td>' +
      '<td>' + item.sellIn + '</td>' +
      '<td>' + item.quality + '</td>' +
      '<td><span class="criticality-badge ' + criticality.className + '">' + criticality.label + '</span></td>' +
      '<td>' + describeRule(item.name) + '</td>';

    row.addEventListener('click', () => {
      selectedItemIndex = selectedItemIndex === index ? null : index;
      render();
    });

    row.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectedItemIndex = selectedItemIndex === index ? null : index;
        render();
      }
    });

    inventoryBody.appendChild(row);
  }
}

function getSortedItems(items: Array<Item>): Array<{ item: Item; index: number }> {
  return items.map((item, index) => ({ item, index })).sort((leftEntry, rightEntry) => {
    const leftItem = leftEntry.item;
    const rightItem = rightEntry.item;

    if (currentSort === 'item-asc') {
      return leftItem.name.localeCompare(rightItem.name);
    }

    if (currentSort === 'item-desc') {
      return rightItem.name.localeCompare(leftItem.name);
    }

    if (currentSort === 'sellIn-lowest') {
      return leftItem.sellIn - rightItem.sellIn || leftItem.name.localeCompare(rightItem.name);
    }

    if (currentSort === 'sellIn-highest') {
      return rightItem.sellIn - leftItem.sellIn || leftItem.name.localeCompare(rightItem.name);
    }

    if (currentSort === 'quality-lowest') {
      return leftItem.quality - rightItem.quality || leftItem.name.localeCompare(rightItem.name);
    }

    if (currentSort === 'quality-highest') {
      return rightItem.quality - leftItem.quality || leftItem.name.localeCompare(rightItem.name);
    }

    if (currentSort === 'criticality-lowest') {
      return getCriticalityLevel(leftItem) - getCriticalityLevel(rightItem) || leftItem.name.localeCompare(rightItem.name);
    }

    return getCriticalityLevel(rightItem) - getCriticalityLevel(leftItem) || leftItem.name.localeCompare(rightItem.name);
  });
}

function renderHistory(): void {
  historyList.innerHTML = '';
  const uiText = dictionaries[currentLanguage];

  for (const snapshot of [...history].reverse()) {
    const listItem = document.createElement('li');
    listItem.className = 'timeline-day';
    listItem.innerHTML =
      '<div class="timeline-title">' +
      '<span>' + uiText.dayLabel(snapshot.day) + '</span>' +
      '<span class="timeline-count">' + uiText.timeline.itemsCount(snapshot.items.length) + '</span>' +
      '</div>' +
      '<div class="timeline-items">' +
      snapshot.items.map((item, index) => renderHistoryItem(item, index)).join('') +
      '</div>';

    historyList.appendChild(listItem);
  }
}

function renderHistoryItem(item: Item, index: number): string {
  const uiText = dictionaries[currentLanguage];
  const qualityClass = getQualityBadgeClass(item.quality);
  const criticality = getSaleCriticality(item);
  const isSelected = selectedItemIndex === index;
  const isDimmed = selectedItemIndex !== null && !isSelected;

  return (
    '<div class="timeline-item ' +
    getTimelineItemClass(item.name) + ' ' +
    (isSelected ? 'timeline-item-selected' : '') + ' ' +
    (isDimmed ? 'timeline-item-dimmed' : '') + '">' +
    '<span class="timeline-item-name">' + escapeHtml(item.name) + '</span>' +
    '<div class="timeline-item-meta timeline-item-meta-list">' +
    '<div>' + uiText.timeline.sellIn + ': ' + item.sellIn + '</div>' +
    '<div>' + uiText.timeline.quality + ': <span class="quality-badge ' + qualityClass + '">' + item.quality + '</span></div>' +
    '<div>' + uiText.timeline.criticality + ': <span class="criticality-badge ' + criticality.className + '">' + criticality.label + '</span></div>' +
    '</div>' +
    '</div>'
  );
}

function getTimelineItemClass(itemName: string): string {
  if (itemName === 'Aged Brie') {
    return 'timeline-item-brie';
  }

  if (itemName === 'Backstage passes to a TAFKAL80ETC concert') {
    return 'timeline-item-backstage';
  }

  if (itemName === 'Sulfuras, Hand of Ragnaros') {
    return 'timeline-item-sulfuras';
  }

  if (itemName.indexOf('Conjured') === 0) {
    return 'timeline-item-conjured';
  }

  return 'timeline-item-normal';
}

function getQualityBadgeClass(quality: number): string {
  if (quality > 10) {
    return 'quality-high';
  }

  if (quality > 5) {
    return 'quality-medium';
  }

  return 'quality-low';
}

function getSaleCriticality(item: Item): { label: string; className: string } {
  const uiText = dictionaries[currentLanguage];
  const level = getCriticalityLevel(item);

  if (level === 3) {
    return {
      label: uiText.criticality.high,
      className: 'criticality-high',
    };
  }

  if (level === 2) {
    return {
      label: uiText.criticality.medium,
      className: 'criticality-medium',
    };
  }

  return {
    label: uiText.criticality.low,
    className: 'criticality-low',
  };
}

function getCriticalityLevel(item: Item): number {
  const criticalQuality = item.quality < 5;
  const criticalSellIn = item.sellIn < 5;
  const warningQuality = item.quality <= 10;
  const warningSellIn = item.sellIn <= 10;

  if (criticalQuality && criticalSellIn) {
    return 3;
  }

  if (warningQuality || warningSellIn) {
    return 2;
  }

  return 1;
}

function describeRule(itemName: string): string {
  const uiText = dictionaries[currentLanguage];

  if (itemName === 'Aged Brie') {
    return uiText.rules.agedBrie;
  }

  if (itemName === 'Backstage passes to a TAFKAL80ETC concert') {
    return uiText.rules.backstage;
  }

  if (itemName === 'Sulfuras, Hand of Ragnaros') {
    return uiText.rules.sulfuras;
  }

  if (itemName.indexOf('Conjured') === 0) {
    return uiText.rules.conjured;
  }

  return uiText.rules.regular;
}

function applyStaticCopy(): void {
  const uiText = dictionaries[currentLanguage];

  document.documentElement.lang = currentLanguage;
  heroEyebrow.textContent = uiText.heroEyebrow;
  heroTitle.textContent = uiText.heroTitle;
  nextDayButton.textContent = uiText.nextDayButton;
  resetButton.textContent = uiText.resetButton;
  languageButton.dataset.language = currentLanguage;
  languageButton.setAttribute('aria-pressed', String(currentLanguage === 'es'));
  inventoryTitle.textContent = uiText.currentInventoryTitle;
  timelineTitle.textContent = uiText.timelineTitle;
  sortLabel.textContent = uiText.sortByLabel;
  highCriticalityMetricLabel.textContent = uiText.metrics.highCriticality;
  averageQualityMetricLabel.textContent = uiText.metrics.averageQuality;
  expiredItemsMetricLabel.textContent = uiText.metrics.expiredItems;
  itemHeader.textContent = uiText.tableHeaders.item;
  sellInHeader.textContent = uiText.tableHeaders.sellIn;
  qualityHeader.textContent = uiText.tableHeaders.quality;
  criticalityHeader.textContent = uiText.tableHeaders.criticality;
  ruleHeader.textContent = uiText.tableHeaders.rule;

  for (const option of Array.from(sortSelect.options)) {
    const value = option.value as keyof typeof uiText.sortOptions;
    option.textContent = uiText.sortOptions[value];
  }

  for (const button of panelToggleButtons) {
    const panelTarget = button.dataset.panelTarget as Exclude<ExpandedPanel, null>;
    const isExpanded = expandedPanel === panelTarget;
    button.dataset.expanded = String(isExpanded);
    button.setAttribute(
      'aria-label',
      (isExpanded ? 'Collapse ' : 'Expand ') + panelTarget + ' panel'
    );
  }
}

function updatePanelLayout(): void {
  layout.classList.toggle('grid-expanded-inventory', expandedPanel === 'inventory');
  layout.classList.toggle('grid-expanded-timeline', expandedPanel === 'timeline');
  inventoryPanel.classList.toggle('panel-expanded', expandedPanel === 'inventory');
  timelinePanel.classList.toggle('panel-expanded', expandedPanel === 'timeline');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

nextDayButton.addEventListener('click', advanceOneDay);
resetButton.addEventListener('click', resetSimulation);
languageButton.addEventListener('click', () => {
  currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
  applyStaticCopy();
  render();
});
for (const button of panelToggleButtons) {
  button.addEventListener('click', () => {
    const panelTarget = button.dataset.panelTarget as Exclude<ExpandedPanel, null>;
    expandedPanel = expandedPanel === panelTarget ? null : panelTarget;
    applyStaticCopy();
    render();
  });
}
sortSelect.addEventListener('change', () => {
  currentSort = sortSelect.value as SortOption;
  render();
});

resetSimulation();
