
export function uuidToColor(uuid) {
  // Hash the UUID to get a consistent value
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
      hash = uuid.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert the hash to a hex color code
  let color = '#';
  for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).slice(-2);
  }

  return color;
}
