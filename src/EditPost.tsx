import * as React from 'react';
import './EditPost.css';
import Post from './Model/Post';
import {observer} from 'mobx-react';

interface EditPostProps {
    post: Post
    onClickSavePost: () => void
}

@observer
export default class EditPost extends React.Component<EditPostProps, void> {
    titleInput: any

    changeTitle(value: string) {
        this.props.post.title = value;
    }

    changeBody(value: string) {
        this.props.post.body = value;
    }

    componentDidMount() {
        if (!this.props.post._id) {
            this.titleInput.focus();
            this.titleInput.select();
        }
    }
    render() {
        return (
            <div className="EditPost">
                <div className="pure-form">
                    <div className="margin-bottom">
                        <input
                            type="text"
                            className="pure-u-1-1"
                            placeholder="Title"
                            ref={input => {this.titleInput = input}}
                            value={this.props.post.title}
                            onChange={e => this.changeTitle(e.target.value)}/>
                    </div>

                    <div className="margin-bottom">
                        <textarea
                            placeholder="Body"
                            className="pure-u-1-1"
                            rows={20}
                            value={this.props.post.body}
                            onChange={e => this.changeBody(e.target.value)}/>
                    </div>
                </div>

                <button
                    type="button"
                    className="pure-button"
                    onClick={e => this.props.onClickSavePost()}>
                    
                    Save Post
                </button>
            </div>
        )
    }
}