# =========================
# CHECK CORRECTNESS
# =========================

def check_correctness(features, task):
    errors = []

    if features.get("syntax_error"):
        return ["SYNTAX_ERROR"]

    funcs = features["functions"]
    expected = task.get("expected_flow", [])

    if "read_file" in expected and "read_file" not in funcs:
        errors.append("DATA_NOT_LOADED")

    if "plot" in expected and "plot" not in funcs:
        errors.append("NO_VISUALIZATION")

    if "show" in expected and "show" not in funcs:
        errors.append("MISSING_SHOW")

    if "buffer" in expected and "buffer" not in funcs:
        errors.append("MISSING_BUFFER")

    if "to_crs" in expected and "to_crs" not in funcs:
        errors.append("CRS_MISSING")

    if "clip" in expected and "clip" not in funcs:
        errors.append("MISSING_CLIP")

    if "area" in expected and "area" not in funcs:
        errors.append("MISSING_AREA")

    if "to_file" in expected and "to_file" not in funcs:
        errors.append("MISSING_EXPORT")

    return errors


# =========================
# OPTIMIZATION (TASK-AWARE)
# =========================

def check_optimization(features, task):
    funcs = features["functions"]
    expected = task.get("expected_flow", [])

    # 🔥 PERFECT → all expected functions present
    if all(f in funcs for f in expected):
        return 3

    # ⚠️ MEDIUM → at least one expected function
    if any(f in funcs for f in expected):
        return 2

    # ❌ BASIC
    return 1


# =========================
# FINAL EVALUATION
# =========================

def evaluate(features, task):
    errors = check_correctness(features, task)

    # ❌ HARD FAIL (syntax only)
    if errors and "SYNTAX_ERROR" in errors:
        return {
            "score": 0,
            "errors": errors,
            "level": 0
        }

    # ⚠️ PARTIAL
    if errors:
        # simple partial score
        return {
            "score": 60,
            "errors": errors,
            "level": 1
        }

    # ✅ FULL → decide by optimization
    level = check_optimization(features, task)

    score_map = {
        1: 70,   # basic
        2: 85,   # medium
        3: 100   # optimized
    }

    return {
        "score": score_map[level],
        "errors": [],
        "level": level
    }