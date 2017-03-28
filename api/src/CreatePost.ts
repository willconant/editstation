const {db} = require('./Db');

interface CreatePostParams {
    title: string
    body: string
    started: string
}

export function adaptCreatePostParams(params: any): CreatePostParams {
    return {
        title: params.title,
        body: params.body,
        started: params.started
    }
}

export async function createPost(params: CreatePostParams) {
    let response = await db.post(params);
    return {
        postId: response.id
    }
}
