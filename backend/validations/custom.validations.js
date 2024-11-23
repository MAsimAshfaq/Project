export const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    const message = "{#label} must be a valid mongo id";
    return helpers.message(message);
  }
  return value;
};
