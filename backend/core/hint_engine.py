def get_hint(hints, error, level):
    level_key = f"level_{min(level, 3)}"
    return hints.get(error, {}).get(level_key, "Try improving your code.")