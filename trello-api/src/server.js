/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environments'
import { APIs_V1 } from '~/routes/v1'
import { corsOptions } from './config/cors'
import { errorHandleMiddleware } from './middlewares/errorHandleMiddleware'
import cookieParser from 'cookie-parser'

const START_SERVER = () => {
    const app = express()

    app.use((req, res, next) => {
        res.set('Cache-control', 'no-store')
        next()
    })

    // config Cookie Parser
    app.use(cookieParser())

    app.use(cors(corsOptions))
    // enable req.body json data
    app.use(express.json())


    app.use('/v1', APIs_V1)

    // middleware
    app.use(errorHandleMiddleware)

    if (env.BUILD_MODE === 'production') {
        app.listen(process.env.PORT, () => {
            console.log(`Server running on PORT: ${process.env.PORT}`)
        })
    } else {
        app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
            console.log(`Server running on local http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}`)
        })

    }

    exitHook(() => {
        CLOSE_DB()
    })
}

(async () => {
    try {
        console.log('Connecting to MongoDB Cloud Atlas...')
        await CONNECT_DB()
        console.log('Connected to MongoDB Cloud Atlas')

        START_SERVER()
    } catch (error) {
        console.error(error)
        process.exit(0)
    }
})()

// CONNECT_DB()
//     .then(() => console.log('Connect to MongoDB Cloud Atlas'))
//     .then(() => START_SERVER())
//     .catch(error => {
//         console.error(error)
//         process.exit(0)
//     })