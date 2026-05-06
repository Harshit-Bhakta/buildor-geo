import ast

def analyze_code(code: str):
    try:
        tree = ast.parse(code)
    except Exception:
        return {
            "functions": [],
            "has_loop": False,
            "syntax_error": True
        }

    functions = []
    has_loop = False

    for node in ast.walk(tree):

        # 🔥 Detect function calls
        if isinstance(node, ast.Call):
            if hasattr(node.func, "attr"):
                functions.append(node.func.attr)

            elif hasattr(node.func, "id"):
                functions.append(node.func.id)

        # 🔥 Detect loops (for optimization)
        if isinstance(node, (ast.For, ast.While)):
            has_loop = True

    return {
        "functions": list(set(functions)),  # remove duplicates
        "has_loop": has_loop,
        "syntax_error": False
    }