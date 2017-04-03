import {observable} from 'mobx';

let querystring = require('querystring');

import Post from './Post';

export default class Store {
    @observable counter: number = 0
    @observable posts: Array<Post> = []
    @observable currentPost: Post | null = null
    @observable editPostIdAfterLoad: string | null = null

    loadPosts() {
        fetch('/ajax/loadPosts').then(
            response => response.json().then(
                json => {
                    this.posts = json.posts;

                    if (this.editPostIdAfterLoad) {
                        this.currentPost = this.posts.filter(post => post._id === this.editPostIdAfterLoad)[0] || null;
                        this.editPostIdAfterLoad = null;
                    }
                }
            )
        )
    }

    startNewPost() {
        this.currentPost = new Post();
        this.currentPost.title = 'Untitled Post';
        this.currentPost.body = '';
        this.currentPost.started = new Date().toISOString();
        this.pushState({mode: 'newPost'});
    }

    editPost(post: Post) {
        this.currentPost = post;
        this.pushState({mode: 'editPost', postId: post._id});
    }

    prepareState(state: any) {
        let title = '';

        switch (state.mode) {
            case 'editPost':
                title = 'Edit Post';
                break;
            
            case 'newPost':
                title = 'New Post';
                break;
            
            case 'postList':
                title = 'Posts';
                break;
            
            default:
                throw new Error('invalid mode: ' + state.mode);
        }

        return [state, title, '/?' + querystring.stringify(state)];
    }

    pushState(state: any) {
        history.pushState.apply(history, this.prepareState(state));
    }

    replaceState(state: any) {
        history.replaceState.apply(history, this.prepareState(state));
    }

    restoreState(state: any) {
        if (state.mode === 'postList') {
            this.currentPost = null;
        }
        else if (state.mode === 'editPost') {
            this.editPostIdAfterLoad = state.postId;
        }
        else if (state.mode === 'newPost') {
            this.startNewPost();
        }
        else {
            throw new Error('invalid mode: ' + state.mode);
        }
    }

    handlePopState(state: any) {
        if (state === null || state.mode === 'postList') {
            this.currentPost = null;
        }
    }

    savePost() {
        if (!this.currentPost) {
            throw new Error('cannot save post if editPost is null');
        }

        let post = this.currentPost;

        if (!post._id) {
            let init = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(post)
            };
            
            fetch('/ajax/createPost', init).then(
                response => response.json().then(
                    json => {
                        post._id = json.postId;
                        this.posts.push(post);

                        this.replaceState({mode: 'editPost', postId: json.postId});
                    }
                )
            )
        }
        else {
            let init = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    postId: post._id,
                    title: post.title,
                    body: post.body,
                    updated: new Date().toISOString(),
                })
            }

            fetch('/ajax/updatePost', init).then(
                response => response.json().then(
                    json => {
                        // nothing to do, I guess
                    }
                )
            )
        }
        
    }
}
