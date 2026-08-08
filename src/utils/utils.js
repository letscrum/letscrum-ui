
export function uuidToColor(uuid) {
  const colors = [
    '#0B6B63',
    '#88415E',
    '#65558F',
    '#2E7185',
    '#855B18',
    '#426B4E',
    '#7B4D3A',
    '#4C6475'
  ]
  let hash = 0

  for (let i = 0; i < (uuid || '').length; i++) {
    hash = uuid.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}
