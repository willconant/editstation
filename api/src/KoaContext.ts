interface KoaContext {
    method: string
    url: string
    query: any
    body: string
    path: string
    status: number
    set: (name: string, value: string) => void
    request: KoaRequest
}

interface KoaRequest {
    body: any
}
