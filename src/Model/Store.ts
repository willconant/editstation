import {observable} from 'mobx';

import Post from './Post';

export default class Store {
    @observable counter: number = 0
    @observable posts: Array<Post> = []
    @observable currentPost: Post | null = null

    loadPosts() {
        fetch('/ajax/loadPosts').then(
            response => response.json().then(
                json => { this.posts = json.posts; }
            )
        )
    }

    startNewPost() {
        this.currentPost = new Post();
        this.currentPost.title = 'Untitled Post';
        this.currentPost.body = '';
        this.currentPost.started = new Date().toISOString();
    }

    editPost(post: Post) {
        this.currentPost = post;
    }

    savePost() {
        if (!this.currentPost) {
            throw new Error('cannot save post if editPost is null');
        }

        let post = this.currentPost;
        this.currentPost = null;

        if (!post.id) {
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
                        post.id = json.postId;
                        this.posts.push(post);
                    }
                )
            )
        }
    }
}
