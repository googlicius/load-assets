export default function isArrayOrString(value: any) {
  return typeof value === 'string' || Array.isArray(value);
}
