const {db} = require('./Db');

export async function loadPosts() {
    let result = await db.allDocs({include_docs: true});
    return {
        posts: result.rows.map(row => row.doc)
    }
}
