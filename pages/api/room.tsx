import { NowRequest, NowResponse } from '@vercel/node'

const UserName = (req: NowRequest, res: NowResponse) => {
  const { name = 'World' } = req.query
  res.send(`Hello ${name}!`)
}

export default UserName