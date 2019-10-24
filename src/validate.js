export function validateRequired(value) {
  return value ? undefined : 'required';
}

export function validateAccountAddress(value) {
  if (/0x10[0123456789abcdef]{40}/i.test(value)) return undefined;
  return 'invalid address';
}

export function validateUint256(value) {
  if (/0x[0123456789abcdef]{64}/i.test(value)) return undefined;
  return 'invalid input';
}

