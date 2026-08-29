import cv2
import os


def analyze_video(file_path):

    video = cv2.VideoCapture(file_path)

    frames = int(video.get(cv2.CAP_PROP_FRAME_COUNT))

    fps = video.get(cv2.CAP_PROP_FPS)

    width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))

    height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))

    duration = frames / fps if fps else 0

    codec = int(video.get(cv2.CAP_PROP_FOURCC))

    suspicious = []

    if fps < 10:
        suspicious.append(
            "Unusually low frame rate."
        )

    if duration == 0:
        suspicious.append(
            "Video duration could not be determined."
        )

    return {

        "analysis_type": "Video",

        "duration": round(duration, 2),

        "frames": frames,

        "fps": round(fps, 2),

        "resolution": f"{width}x{height}",

        "codec": codec,

        "metadata_integrity": len(suspicious) == 0,

        "suspicious_findings": suspicious

    }