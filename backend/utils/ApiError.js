class ApiError extends Error {
  constructor(
    statusCode,
    message,
    errorCode,
    serviceName = "",
    isOperational = true,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.serviceName = serviceName;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
