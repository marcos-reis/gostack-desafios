const formatValue = (value: Date): string =>
  Intl.DateTimeFormat('en-GB').format(value);

export default formatValue;
