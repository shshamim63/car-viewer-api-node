import { Router } from 'express'

import * as defaultController from '../controller/defaultController'

const router = Router()

router.get('/', defaultController.root)

export { router }
