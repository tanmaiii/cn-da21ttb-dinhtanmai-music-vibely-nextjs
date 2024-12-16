export class ApiError extends Error {
  public statusCode: number; 
  public message: string; 
  public stack?: string; 

  constructor(statusCode: number, message: string, stack?: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.stack = stack;

    // Ghi lại Stack Trace (dấu vết ngăn xếp) để thuận tiện cho việc debug
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
