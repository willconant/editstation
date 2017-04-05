import * as React from 'react';
import './App.css';
import Store from './Model/Store';
import Menu from './Menu';
import PostList from './PostList';
import EditPost from './EditPost';
import {observer} from 'mobx-react';

// const logo = require('./logo.svg');

interface AppProps {
    store: Store
}

@observer
export default class App extends React.Component<AppProps, void> {
    render() {
        return (
            <div className="App">
                <Menu store={this.props.store}/>
                {
                    this.props.store.state.mode === 'editPost' || this.props.store.state.mode === 'newPost' ? (
                        this.props.store.draftPost ? (
                            <EditPost
                                post={this.props.store.draftPost}
                                onClickSavePost={() => this.props.store.savePost()}/>
                        ) : null
                    ) : (
                        <PostList
                            posts={this.props.store.posts}
                            onClickStartNewPost={() => this.props.store.pushState({mode: 'newPost'})}
                            onClickEditPost={postId => this.props.store.pushState({mode: 'editPost', postId: postId})}/>
                    )
                }
            </div>
        );
    }
}
