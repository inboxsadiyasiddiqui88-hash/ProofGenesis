import os
from PIL import Image
import fitz  # PyMuPDF
from mutagen import File as AudioFile


def extract_metadata(file_path: str):

    extension = os.path.splitext(file_path)[1].lower()

    metadata = {
        "file_name": os.path.basename(file_path),
        "file_size": os.path.getsize(file_path)
    }

    try:

        # IMAGE
        if extension in [".jpg", ".jpeg", ".png"]:

            image = Image.open(file_path)

            metadata["file_type"] = "Image"
            metadata["width"] = image.width
            metadata["height"] = image.height
            metadata["format"] = image.format

        # PDF
        elif extension == ".pdf":

            pdf = fitz.open(file_path)

            metadata["file_type"] = "PDF"
            metadata["pages"] = pdf.page_count
            metadata["pdf_metadata"] = pdf.metadata

            pdf.close()

        # AUDIO
        elif extension in [".mp3", ".wav"]:

            audio = AudioFile(file_path)

            metadata["file_type"] = "Audio"

            if audio:
                metadata["duration"] = audio.info.length

        else:

            metadata["file_type"] = "Unknown"

    except Exception as e:

        metadata["error"] = str(e)

    return metadata