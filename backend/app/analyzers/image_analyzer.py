from PIL import Image
import os


def analyze_image(file_path: str):

    image = Image.open(file_path)

    width, height = image.size

    file_size = os.path.getsize(file_path)

    result = {
        "resolution": f"{width} x {height}",
        "width": width,
        "height": height,
        "file_size": file_size,
        "format": image.format,
        "analysis": [],
        "authenticity_score": 100
    }

    # Resolution Check
    if width < 500 or height < 500:
        result["analysis"].append(
            "Low resolution image detected."
        )
        result["authenticity_score"] -= 10

    # File Size Check
    if file_size < 100000:
        result["analysis"].append(
            "Very small file size."
        )
        result["authenticity_score"] -= 10

    # PNG Warning
    if image.format == "PNG":
        result["analysis"].append(
            "PNG files may have lost original camera metadata."
        )

    if len(result["analysis"]) == 0:
        result["analysis"].append(
            "No obvious forensic indicators detected."
        )

    return result