const { init } = require ('../dbConfig')
const { ObjectId } = require('mongodb')

class Post {
    constructor(data){
        this.id = data.id
        this.title = data.title
        this.author = data.author
        this.content = data.content
    }

    static get all() {
        return new Promise (async (resolve, reject) => {
            try {
                const db = await init()
                const postsData = await db.collection('posts').find().toArray()
                const posts = postsData.map(d => new Post({ ...d, id: d._id }))
                resolve(posts);
            } catch (err) {
                console.log(err);
                reject("Error retrieving posts")
            }
        })
    }

    static findById (id) {
        return new Promise (async (resolve, reject) => {
            try {
                const db = await init();
                let postData = await db.collection('posts').find({ _id: ObjectId(id) }).toArray()
                let post = new Post({...postData[0], id: postData[0]._id});
                resolve (post);
            } catch (err) {
                reject('Post not found');
            }
        });
    }

    static create(title, author, content){
        return new Promise (async (resolve, reject) => {
            try {
                const db = await init();
                let postData = await db.collection('posts').insertOne({ title, author, content })
                let newPost = new Post(postData.ops[0]);
                resolve (newPost);
            } catch (err) {
                reject('Error creating post');
            }
        });
    }
}

module.exports = Post;
