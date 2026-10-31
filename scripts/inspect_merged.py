import openpyxl

wb = openpyxl.load_workbook('Agile Document (Recovered).xlsx')
ws = wb['Product Backlog']

print("Merged ranges in Product Backlog:")
for rng in ws.merged_cells.ranges:
    if any(r >= 18 for r in range(rng.min_row, rng.max_row + 1)):
        print(rng)

# Let's inspect the columns of row 18 to 22
for r in range(16, 25):
    row_vals = []
    for c in range(1, 12):
        cell = ws.cell(r, c)
        row_vals.append(f"C{c}:{type(cell).__name__}({cell.value})")
    print(f"R{r}: " + " | ".join(row_vals[:8]))

