from core.analyzer import analyze_code
from core.loader import load_task, load_hints
from core.evaluator import evaluate
from core.hint_engine import get_hint


def submit_code(task_id, code, hint_level=1, hint_mode=False):
    task = load_task(task_id)
    hints = load_hints(task_id)

    features = analyze_code(code)
    result = evaluate(features, task)

    # ❌ syntax error → hard fail
    if result["errors"] and "SYNTAX_ERROR" in result["errors"]:
        return {
            "status": "error",
            "score": 0,
            "errors": result["errors"],
            "hint": "Fix syntax error in your code",
            "level": 0
        }

    # ⚠️ partial
    if result["errors"]:
        hint = None
        if hint_mode:
            hint = get_hint(hints, result["errors"][0], hint_level)

        return {
            "status": "partial",
            "score": result["score"],
            "errors": result["errors"],
            "hint": hint,
            "level": result["level"]
        }

    # ✅ completed
    return {
        "status": "completed",
        "score": result["score"],
        "errors": [],
        "hint": None,
        "level": result["level"]
    }