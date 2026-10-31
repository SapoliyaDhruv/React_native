import docx

doc = docx.Document('MindSprint_Project_Documentation.docx')
for i in [0, 1, 2, 76, 77, 169, 171]:
    p = doc.paragraphs[i]
    r_font = p.runs[0].font.name if p.runs and p.runs[0].font.name else 'default'
    r_size = p.runs[0].font.size.pt if p.runs and p.runs[0].font.size else 'default'
    r_bold = p.runs[0].font.bold if p.runs else 'default'
    print(f'P{i}: "{p.text}" | style: {p.style.name} | font: {r_font}, size: {r_size}, bold: {r_bold}')

