from mutagen import File


def analyze_audio(file_path):

    audio = File(file_path)

    suspicious = []

    bitrate = getattr(audio.info, "bitrate", None)
    sample_rate = getattr(audio.info, "sample_rate", None)

    if bitrate is None:
        suspicious.append(
            "Bitrate information unavailable."
        )

    if sample_rate is None:
        suspicious.append(
            "Sample rate unavailable."
        )

    return {

        "analysis_type": "Audio",

        "duration": round(audio.info.length, 2),

        "bitrate": bitrate,

        "sample_rate": sample_rate,

        "codec": audio.mime[0] if audio.mime else "Unknown",

        "metadata_available": len(suspicious) == 0,

        "suspicious_findings": suspicious

    }