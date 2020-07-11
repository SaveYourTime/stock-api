export function exportStocks(): string[][] {
  const stockRows = [
    ...(<HTMLTableElement>document.getElementById('tblStockList')).rows,
  ];

  const stocks = stockRows
    .filter((row) => row.hasAttribute('id'))
    .map((row) => [...row.cells].map((cell) => cell.textContent));

  return stocks;
}
