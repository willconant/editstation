import {adaptCreatePostParams, createPost} from './CreatePost';
import {loadPosts} from './LoadPosts';

let adaptors = {
    createPost: async function(params) {
        return await createPost(adaptCreatePostParams(params));
    },

    loadPosts: async function(params) {
        return await loadPosts();
    }
};

export async function adaptAjaxCall(method: string, params: any) {
    let adaptor = adaptors[method];

    if (!method) {
        return {
            error: 'invalid ajax method ' + method;
        }
    }

    return await adaptor(params);
}
