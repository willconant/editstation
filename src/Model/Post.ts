import {observable} from 'mobx';

export default class Post {
    @observable _id: string | null = null
    @observable title: string
    @observable body: string
    @observable started: string
    @observable published: string | null = null
}
