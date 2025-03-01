export const IsWithin = (value: number, num1: number, num2: number) => {
  const min = Math.min(num1, num2);
  const max = Math.max(num1, num2);

  return value >= min && value <= max;
};
