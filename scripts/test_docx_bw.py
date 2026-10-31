from docx.oxml import parse_xml
import docx

doc = docx.Document()
t = doc.add_table(rows=2, cols=4)
tblPr = t._element.xpath('w:tblPr')[0]
borders = parse_xml(
    '<w:tblBorders xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
    '<w:top w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
    '<w:left w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
    '<w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
    '<w:right w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
    '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>'
    '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>'
    '</w:tblBorders>'
)
tblPr.append(borders)
doc.save('test_bw_table.docx')
print("Successfully generated test B&W table!")
import os
os.remove('test_bw_table.docx')

