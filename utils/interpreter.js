
class Context {
    constructor(command) {
      this.command = command;
    }
  }
  
  class Expression {
    interpret(context) {
      throw new Error("Este método deve ser sobrescrito.");
    }
  }
  
  class SentimentoExpression extends Expression {
    interpret(context) {
      const match = context.command.match(/\b(positivo|negativo|neutro)\b/);
      return match ? match[1] : null;
    }
  }
  
  class EventoIdExpression extends Expression {
    interpret(context) {
      const match = context.command.match(/eventoId=(\d+)/);
      return match ? parseInt(match[1]) : null;
    }
  }
  
  function interpretarComando(command) {
    const context = new Context(command);
    const sentimento = new SentimentoExpression().interpret(context);
    const eventoId = new EventoIdExpression().interpret(context);
    return { sentimento, eventoId };
  }
  
  module.exports = { interpretarComando };
  