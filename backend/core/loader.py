import json
import os

BASE_PATH = os.path.dirname(os.path.dirname(__file__))

def load_task(task_id):
    path = os.path.join(BASE_PATH, "tasks", task_id, "task.json")

    if not os.path.exists(path):
        raise Exception(f"Task not found at: {path}")

    with open(path, "r") as f:
        return json.load(f)


def load_hints(task_id):
    path = os.path.join(BASE_PATH, "tasks", task_id, "hints.json")

    if not os.path.exists(path):
        raise Exception(f"Hints not found at: {path}")

    with open(path, "r") as f:
        return json.load(f)