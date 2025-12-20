import { floodBufferTask, RuleError } from "./taskRules";

export function analyzeCode(code: string): RuleError[] {
  const errors: RuleError[] = [];

  floodBufferTask.rules.forEach(rule => {
    if (rule.check(code)) {
      errors.push(rule.id);
    }
  });

  return errors;
}
