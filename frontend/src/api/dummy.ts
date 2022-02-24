import axios from 'axios'

const client = axios.create()

export const dummyRequest = async (): Promise<boolean> => {
    const x = await client.get('https://duckduckgo.com/')
    return x.status === 200
}

export const badDummyRequest = async (): Promise<boolean> => {
    await client.get('https://duckduckgo.com/')
    return false
}

export const randomDummyRequest = async (): Promise<boolean> => {
    await client.get('https://duckduckgo.com/')
    let res = Math.random() > 0.5
    for (let i = 0; i < 5000000; i++) {
        res = Math.random() > 0.5
    }
    console.log(res)
    return res
}
