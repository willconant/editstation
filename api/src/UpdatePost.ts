const {db} = require('./Db');

interface UpdatePostParams {
    postId: string
    title: string
    body: string
    updated: string
}

export function adaptUpdatePostParams(params: any): UpdatePostParams {
    return {
        postId: params.postId,
        title: params.title,
        body: params.body,
        updated: params.updated,
    }
}

export async function updatePost(params: UpdatePostParams) {
    let response = await db.update(params.postId, doc => {
        doc.title = params.title;
        doc.body = params.body;
        doc.update = params.updated;
        return doc;
    });
}
