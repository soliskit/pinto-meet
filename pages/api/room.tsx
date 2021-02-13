import { NowRequest, NowResponse } from '@vercel/node'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const UserName = (req: NowRequest, res: NowResponse) => {
  const { name = 'World' } = req.query
  res.send(`Hello ${name}!`)
}

export default UserName
