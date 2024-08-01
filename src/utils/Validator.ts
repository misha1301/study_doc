interface IValidationRule {
  validate(): boolean;
  errorMessage: ErrorMessage;
}

interface IValidationResult {
  isValid: boolean;
  errorMessages: ErrorMessage[];
}

class ErrorMessage {
  message: string;
  constructor(errorMessage: string) {
    this.message = errorMessage;
  }
}

class Rule implements IValidationRule {
  condition: () => boolean;
  errorMessage!: ErrorMessage;

  constructor(condition: () => boolean) {
    this.condition = condition;
  }

  validate(): boolean {
    return this.condition();
  }
}

export default class AppValidator {
  private currentRule!: Rule ;
  private allRules: Rule[] = [];
  private isValid: boolean = true;

  When(condition: () => boolean) {
    this.currentRule = new Rule(condition);
    return this;
  }

  Then(errorMessage: string) {
    this.currentRule.errorMessage = new ErrorMessage(errorMessage);
    this.allRules.push(this.currentRule);
    return this;
  }

  Apply() {
    let errorMessages: ErrorMessage[] = [];
    this.isValid = true;

    this.allRules.forEach((rule) => {
      if (rule.validate()) {
        errorMessages.push(rule.errorMessage);
        this.isValid = false;
      }
    });

    return { isValid: this.isValid, errorMessages: errorMessages };
  }
}
