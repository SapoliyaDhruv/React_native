import docx

doc = docx.Document('MindSprint_Project_Documentation.docx')
t = doc.tables[0]
for r_idx in range(len(t.rows)):
    cells = t.rows[r_idx].cells
    print(f"R{r_idx}: " + " | ".join(c.text.strip() for c in cells))

