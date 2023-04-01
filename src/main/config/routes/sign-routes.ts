import { Router } from "express"

export default (route: Router): void => {
  route.post('/signup', (req, res) => {
    res.status(201).json({ ok: 'ok' })
  })
}

