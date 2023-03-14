import { Router } from 'express'

import * as defaultController from '../controller/default.controller'

const router = Router()

router.get('/', defaultController.root)

export { router }
