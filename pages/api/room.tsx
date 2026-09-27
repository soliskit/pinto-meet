import type { NextApiRequest, NextApiResponse } from 'next'

const UserName = (req: NextApiRequest, res: NextApiResponse) => {
  const { name = 'World' } = req.query
  res.send(`Hello ${name}!`)
}

export default UserName
