from paddleocr import PaddleOCR

ocr = PaddleOCR(
    lang="en",
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False
)

result = ocr.predict("sample.jpeg")

for page in result:
    for text in page["rec_texts"]:
        print(text)