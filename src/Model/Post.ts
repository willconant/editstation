import {observable} from 'mobx';

export default class Post {
    @observable id: string | null = null
    @observable title: string
    @observable body: string
    @observable started: string
    @observable published: string | null = null
}
