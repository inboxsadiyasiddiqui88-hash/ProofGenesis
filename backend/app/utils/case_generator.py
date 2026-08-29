from datetime import datetime
from app.database.mongodb import cases_collection

def generate_case_id():

    year = datetime.now().year

    latest_case = cases_collection.find_one(
        {"case_id": {"$regex": f"^CASE-{year}-"}},
        sort=[("created_at", -1)]
    )

    if latest_case is None:
        return f"CASE-{year}-0001"

    latest_id = latest_case["case_id"]

    try:
        number = int(latest_id.split("-")[-1])
    except ValueError:
        number = 0

    next_number = number + 1

    return f"CASE-{year}-{next_number:04d}"