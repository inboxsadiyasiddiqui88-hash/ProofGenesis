from app.database.mongodb import evidence_collection


def generate_evidence_id():

    latest = evidence_collection.find_one(
        sort=[("evidence_id", -1)]
    )

    if latest and "evidence_id" in latest:

        latest_id = latest["evidence_id"]

        number = int(latest_id.split("-")[-1])

    else:

        number = 0

    return f"PG-EV-2026-{number + 1:05d}"