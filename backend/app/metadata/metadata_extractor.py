import os

from PIL import Image
import fitz
from mutagen import File as AudioFile
import cv2


def extract_metadata(file_path: str):

    extension = os.path.splitext(
        file_path
    )[1].lower()

    metadata = {

        "file_name": os.path.basename(
            file_path
        ),

        "file_size": os.path.getsize(
            file_path
        )

    }

    try:

        # ==========================================
        # IMAGE
        # ==========================================

        if extension in [
            ".jpg",
            ".jpeg",
            ".png"
        ]:

            image = Image.open(
                file_path
            )

            metadata["file_type"] = "Image"

            metadata["width"] = image.width

            metadata["height"] = image.height

            metadata["format"] = image.format


        # ==========================================
        # PDF
        # ==========================================

        elif extension == ".pdf":

            pdf = fitz.open(
                file_path
            )

            metadata["file_type"] = "PDF"

            metadata["pages"] = pdf.page_count

            metadata["pdf_metadata"] = (
                pdf.metadata
            )

            pdf.close()


        # ==========================================
        # AUDIO
        # ==========================================

        elif extension in [
            ".mp3",
            ".wav",
            ".aac",
            ".ogg",
            ".opus",
            ".m4a"
        ]:

            audio = AudioFile(
                file_path
            )

            metadata["file_type"] = "Audio"

            if audio:

                metadata["duration"] = (
                    audio.info.length
                )


        # ==========================================
        # VIDEO
        # ==========================================

        elif extension in [
            ".mp4",
            ".avi",
            ".mov",
            ".mkv"
        ]:

            video = cv2.VideoCapture(
                file_path
            )

            frames = int(
                video.get(
                    cv2.CAP_PROP_FRAME_COUNT
                )
            )

            fps = video.get(
                cv2.CAP_PROP_FPS
            )

            width = int(
                video.get(
                    cv2.CAP_PROP_FRAME_WIDTH
                )
            )

            height = int(
                video.get(
                    cv2.CAP_PROP_FRAME_HEIGHT
                )
            )

            duration = (
                frames / fps
                if fps
                else 0
            )

            metadata["file_type"] = "Video"

            metadata["frames"] = frames

            metadata["fps"] = round(
                fps,
                2
            )

            metadata["width"] = width

            metadata["height"] = height

            metadata["resolution"] = (
                f"{width} x {height}"
            )

            metadata["duration"] = round(
                duration,
                2
            )

            video.release()


        # ==========================================
        # UNKNOWN
        # ==========================================

        else:

            metadata["file_type"] = "Unknown"


    except Exception as e:

        metadata["error"] = str(e)


    return metadata