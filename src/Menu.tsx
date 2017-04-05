import * as React from 'react';
import './Menu.css';
import Store from './Model/Store';
import {observer} from 'mobx-react';

interface MenuProps {
    store: Store
}

@observer
export default class Menu extends React.Component<MenuProps, void> {
    render() {
        return (
            <div className="Menu pure-menu pure-menu-horizontal">
                <ul className="pure-menu-list">
                    <MenuItem selected={this.props.store.state.mode === 'postList'} onClick={() => this.props.store.pushState({mode: 'postList'})} label="All Posts"/>
                </ul>
            </div>
        )
    }
}

interface MenuItemProps {
    onClick: () => void
    selected: boolean
    label: string
}

class MenuItem extends React.Component<MenuItemProps, void> {
    render() {
        let className = 'pure-menu-item';

        if (this.props.selected) {
            className += ' pure-menu-selected';
        }

        let onClick = (event: any) => {
            event.preventDefault();
            this.props.onClick();
        }

        return (
            <li className={className}><a className="pure-menu-link" href="#" onClick={onClick}>{this.props.label}</a></li>
        )
    }
}