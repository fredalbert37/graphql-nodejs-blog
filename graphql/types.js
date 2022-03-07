const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = require("graphql");
const { User, Post, Comment } = require("../models");


const UserType = new GraphQLObjectType({
    name: "UserType",
    description: "The user type",
    fields: {
        id: {type: GraphQLID},
        username: {type:GraphQLString},
        email: {type: GraphQLString},
        displayName: {type:GraphQLString},
        createdAt:  {type: GraphQLString},
        updatedAt:  {type: GraphQLString}
    }
})


const PostType = new GraphQLObjectType({
    name: "PostType",
    description: "The post type",
    fields: () =>  ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        body: {type: GraphQLString},
        createdAt: {type: GraphQLString},
        updatedAt: {type: GraphQLString},
        author: {type: UserType, resolve(parent){
            return User.findById(parent.authorId)
        }},
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent){
                return Comment.find({postId: parent.id})
            }
        }
    })
})

const CommentType = new GraphQLObjectType({
    name: "CommentType",
    description: "The comment type",
    fields: {
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        createdAt: {type: GraphQLString},
        updatedAt: {type: GraphQLString},
        user: {type:UserType, resolve(parent){
            return User.findById(parent.userId)
        }},
        post: {type:PostType, resolve(parent){
            return Post.findById(parent.postId)
        }}
    }
})



module.exports = {UserType, PostType, CommentType}