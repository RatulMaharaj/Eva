from PyPDF2 import PdfFileWriter, PdfFileReader, utils
from app import UPLOAD_FOLDER

FILE_PATH = UPLOAD_FOLDER + "\\"
FILE_NAME = "ASSA_Encrypted.pdf"

def encrypt_file(filename, password, mode = "encrypt"):
    """
    This function can be used to encrypt '.pdf' files
    """

    fullpath = FILE_PATH + filename

    if mode == 'encrypt':

        pdf_writer = PdfFileWriter()
        pdf_reader = PdfFileReader(fullpath)

        for page in range(pdf_reader.getNumPages()):
            pdf_writer.addPage(pdf_reader.getPage(page))

        pdf_writer.encrypt(user_pwd=password, owner_pwd=None, use_128bit=True)
        
        output = "." + fullpath.strip(".pdf") + "_Encrypted.pdf"
        
        with open(output, 'wb+') as pdf_file_encrypted:
            pdf_writer.write(pdf_file_encrypted)
    
    if mode == 'decrypt':

        pdf_reader = PdfFileReader(fullpath)
        pdf_reader.decrypt(password)
        pdf_writer = PdfFileWriter()

        try:
            for page_number in range(pdf_reader.numPages):
                pdf_writer.addPage(pdf_reader.getPage(page_number))

        except utils.PdfReadError:
            return("The file could not be decrypted")

        output = "." + fullpath.strip(".pdf") + "_Decrypted.pdf"

        with open(output, 'wb') as pdf_file_decrypted:
            pdf_writer.write(pdf_file_decrypted)

encrypt_file("ASSA_Encrypted.pdf","Ratul@01",mode="decrypt")
