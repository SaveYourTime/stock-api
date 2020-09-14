export function exportStocks(): string[][] {
  const stockRows = [...(<HTMLTableElement>document.getElementById('tblStockList')).rows];

  const stocks = stockRows
    .filter((row) => row.hasAttribute('id'))
    .map((row) => [...row.cells].map((cell) => cell.textContent));

  return stocks;
}

export function exportStockDetail(): string[] {
  const tds = [...document.querySelectorAll('.solid_1_padding_4_4_tbl')].find(
    ({ innerHTML }) => innerHTML.includes('名稱') && innerHTML.includes('產業別'),
  );
  if (!tds) return null;

  const details = [...tds.querySelectorAll('tr td[bgcolor="white"]')].map((td) => td.textContent);
  return details;
}

export function exportStockEquityDistribution(): {
  date: string;
  lessThan50: number;
} {
  const rows = <HTMLTableRowElement[]>[
    ...document.querySelectorAll('#divDetail table.solid_1_padding_4_2_tbl tbody tr'),
  ];
  rows.length = 3;

  const distribution = rows
    .map(({ cells }) => [...cells].map((td) => td.textContent))
    .filter((values) => !values.includes(''))
    .map((value) => {
      const year = `20${value[0].split('W')[0]}`;
      const date = `${year}/${value[1]}`;
      const lessThan50 = parseFloat(value[5]) + parseFloat(value[6]);
      return { date, lessThan50 };
    })
    .find(({ date, lessThan50 }) => {
      const d = new Date(date);
      return d instanceof Date && !isNaN(d.valueOf()) && !isNaN(lessThan50);
    });
  return distribution;
}
