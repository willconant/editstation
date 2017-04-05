import {observable} from 'mobx';

let querystring = require('querystring');

import Post from './Post';

interface StoreState {
    mode: 'postList' | 'newPost' | 'editPost'
    postId?: string
}

export default class Store {
    @observable state: StoreState
    @observable posts: Array<Post> = []
    @observable draftPost: Post | null

    @observable postsAreLoaded = false

    postLoadFunctions: Array<() => void> = []
    
    loadPosts() {
        fetch('/ajax/loadPosts').then(
            response => response.json().then(
                json => {
                    this.posts = json.posts;
                    this.postsAreLoaded = true;

                    for (let f of this.postLoadFunctions) {
                        f();
                    }
                }
            )
        )
    }

    doAfterPostsAreLoaded(f: () => void) {
        if (!this.postsAreLoaded) {
            this.postLoadFunctions.push(f);
        }
        else {
            f();
        }
    }

    getPostById(postId: string) {
        for (let post of this.posts) {
            if (post._id === postId) {
                return post;
            }
        }

        return null;
    }

    prepareState(state: StoreState) {
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

    pushState(state: StoreState) {
        history.pushState.apply(history, this.prepareState(state));
        this.applyState(state);
    }

    replaceState(state: StoreState) {
        history.replaceState.apply(history, this.prepareState(state));
        this.applyState(state);
    }

    restoreState(state: StoreState) {
        this.state = state;
        this.applyState(state);
    }

    handlePopState(state: StoreState) {
        this.state = state;
        this.applyState(state);
    }

    applyState(state: StoreState) {
        this.state = state;

        if (state.mode === 'postList') {
            this.draftPost = null;
        }
        else if (state.mode === 'newPost') {
            this.initNewPostDraft();
        }
        else if (state.mode === 'editPost') {
            this.initEditPostDraft(state.postId!);
        }
    }

    initNewPostDraft() {
        let post = new Post();
        post.title = 'Untitled Post';
        post.body = '';
        post.started = new Date().toISOString();

        this.draftPost = post;
    }

    initEditPostDraft(postId: string) {
        this.doAfterPostsAreLoaded(() => {
            let post = this.getPostById(postId);

            if (post === null) {
                throw new Error('cannot load post ' + postId);
            }
            else {
                this.draftPost = Object.assign(new Post(), post);
            }
        })
    }

    savePost() {
        if (!this.draftPost) {
            throw new Error('cannot save post if draftPost is null');
        }

        // make a copy before saving the post
        let post = Object.assign(new Post(), this.draftPost);

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
                        // replace the old post in the list with the copy we made above
                        this.posts = this.posts.map(postInList => postInList._id === post._id ? post : postInList);
                    }
                )
            )
        }
        
    }
}
