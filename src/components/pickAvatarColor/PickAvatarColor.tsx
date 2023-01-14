import { grey, red, teal, deepOrange, blue, deepPurple, pink, amber, cyan, green } from '@mui/material/colors'

const AvatarPalette = [grey[700], red[700], teal[700], deepOrange[700], blue[700], deepPurple[700], pink[700], amber[700], cyan[700], green[700]]
export const PickAvatarColor = (id: string, colorSet: string[]): string => {
  const i = id.length
  const code = id[i - 1]
  const codeNumber = Number(code)
  const pickedColor = colorSet[codeNumber]
  return pickedColor
}
console.log(PickAvatarColor('1', AvatarPalette))
