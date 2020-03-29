from PyPDF2 import PdfFileWriter, PdfFileReader, utils

def encrypt_file(filename, password, mode = "encrypt"):
    """
    This function can be used to encrypt pdf files
    """

    if mode == 'encrypt':

        pdf_writer = PdfFileWriter()
        pdf_reader = PdfFileReader(filename)

        for page in range(pdf_reader.getNumPages()):
            pdf_writer.addPage(pdf_reader.getPage(page))

        pdf_writer.encrypt(user_pwd=password, owner_pwd=None, use_128bit=True)
        
        output = filename.rstrip("pdf").rstrip(".") + "_encrypted.pdf"
        print(output)
        with open(output, 'wb+') as pdf_file_encrypted:
            pdf_writer.write(pdf_file_encrypted)
    
    if mode == 'decrypt':

        pdf_reader = PdfFileReader(filename)
        pdf_reader.decrypt(password)
        pdf_writer = PdfFileWriter()

        try:
            for page_number in range(pdf_reader.numPages):
                pdf_writer.addPage(pdf_reader.getPage(page_number))

        except utils.PdfReadError:
            return("The file could not be decrypted")

        output = filename.rstrip("pdf").rstrip(".") + "_decrypted.pdf"

        with open(output, 'wb') as pdf_file_decrypted:
            pdf_writer.write(pdf_file_decrypted)

