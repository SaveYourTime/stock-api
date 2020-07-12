export function exportStocks(): string[][] {
  const stockRows = [
    ...(<HTMLTableElement>document.getElementById('tblStockList')).rows,
  ];

  const stocks = stockRows
    .filter((row) => row.hasAttribute('id'))
    .map((row) => [...row.cells].map((cell) => cell.textContent));

  return stocks;
}

export function exportStockDetail(): string[] {
  const tds = [...document.querySelectorAll('.solid_1_padding_4_4_tbl')].find(
    ({ innerHTML }) =>
      innerHTML.includes('名稱') && innerHTML.includes('產業別'),
  );
  if (!tds) return null;

  const details = [...tds.querySelectorAll('tr td[bgcolor="white"]')].map(
    (td) => td.textContent,
  );
  return details;
}
