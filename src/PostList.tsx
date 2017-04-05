import * as React from 'react';
import './PostList.css';
import Post from './Model/Post';
import {observer} from 'mobx-react';

interface PostListProps {
    posts: Array<Post>
    onClickStartNewPost: () => void
    onClickEditPost: (postId: string) => void
}

@observer
export default class PostList extends React.Component<PostListProps, void> {
    clickEditPost(event: any, postId: string) {
        event.preventDefault();
        this.props.onClickEditPost(postId);
    }
    render() {
        return (
            <div className="PostList">
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th style={{width: '15%'}}>Started</th>
                            <th style={{width: '15%'}}>Published</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.posts.map(post => (
                            <tr key={post._id || 'null'}>
                                <td><a href="#" onClick={e => this.clickEditPost(e, post._id!)}>{post.title}</a></td>
                                <td>{post.started}</td>
                                <td>{post.published}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button
                    type="button"
                    className="pure-button"
                    onClick={e => this.props.onClickStartNewPost()}>
                    
                    Start New Post
                </button>
            </div>
        )
    }
}