import os

from app.analyzers.image_analyzer import analyze_image
from app.analyzers.pdf_analyzer import analyze_pdf
from app.analyzers.video_analyzer import analyze_video
from app.analyzers.audio_analyzer import analyze_audio


def analyze_file(file_path):

    extension = os.path.splitext(file_path)[1].lower()

    if extension in [".jpg", ".jpeg", ".png"]:

        return "image", analyze_image(file_path)

    elif extension == ".pdf":

        return "pdf", analyze_pdf(file_path)

    elif extension in [".mp4", ".avi", ".mov", ".mkv"]:

        return "video", analyze_video(file_path)

    elif extension in [".mp3", ".wav", ".aac"]:

        return "audio", analyze_audio(file_path)

    else:

        raise Exception("Unsupported file type.")