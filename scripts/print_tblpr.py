import pptx

prs = pptx.Presentation('Review_Presentation_backup_orig.pptx')
s20 = prs.slides[19]
for shp in s20.shapes:
    if shp.has_table:
        print("Table style ID:", shp.table._tbl.attrib if hasattr(shp.table._tbl, 'attrib') else 'None')
        # print xml of tblPr
        tblPr = shp.table._tbl.tblPr
        print("tblPr xml:", tblPr.xml)

