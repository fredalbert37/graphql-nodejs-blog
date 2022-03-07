const { GraphQLString, GraphQLID } = require("graphql");
const {User, Post, Comment} = require('../models')
const {createJWTToken} = require('../util/auth')
const bcrypt = require('bcrypt');
const { PostType, CommentType } = require("./types");

const register = {
    type: GraphQLString,
    description: "Register a new user and returns a token",
    args: {
        username: {type:GraphQLString},
        email: {type:GraphQLString},
        password: {type:GraphQLString},
        displayName: {type:GraphQLString},
    },
    async resolve(_, args) {
        const {username, email, password, displayName} = args;
        
        const user = new User({username, email, password, displayName})
        await user.save();

        const token = createJWTToken({
            _id: user._id,
            username: user.username,
            email: user.email,
            displayName: user.displayName
        });
        
        return token;
    }
};

const login = {
    type: GraphQLString,
    description: "Login a user and returns a token",
    args: {
        email: {type: GraphQLString},
        password: {type: GraphQLString},
    },
    async resolve(_, args){
        const user = await User.findOne({email: args.email}).select('+password')

        if(!user) throw new Error("Invalid Email");
        
        const auth = await bcrypt.compare(args.password, user.password)
        if(auth){
            const token = createJWTToken({
                _id: user._id,
                username: user.username,
                email: user.email,
                displayName: user.displayName
            });
            return token;
        }else{
            throw new Error('Incorrect Password');
        }
    }
}

const createPost = {
    type: PostType,
    description: "Create Post",
    args: {
        title: {type: GraphQLString},
        body: {type: GraphQLString}
    },
    async resolve(_, args, {verifiedUser}){
        if(!verifiedUser) throw new Error("Unauthorized")

        const newPost = new Post({
            title: args.title,
            body: args.body,
            authorId: verifiedUser._id
        })
        const post = await newPost.save();

        return post;
    }
}

const updatePost = {
    type: PostType,
    description: "Update a Post",
    args: {
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        body: {type: GraphQLString}
    },
    resolve: async (_, {id, title, body}, {verifiedUser}) => {
        if(!verifiedUser) throw new Error("Unauthorized")

        const updatedPost = await Post.findByIdAndUpdate(
            {_id: id, authorId: verifiedUser._id},
            {
                title,
                body
            },
            {
                new: true,
                runValidators: true
            }
        )
        
        return updatedPost;
    }

}

const deletePost = {
    type: GraphQLString,
    description: "Delete a Post",
    args: {
        postId: {type: GraphQLID}
    },
    resolve: async (_, {postId}, {verifiedUser}) => {
        if(!verifiedUser) throw new Error("Unauthorized")

        const postDeleted = await Post.findByIdAndDelete({
            _id: postId,
            authorId: verifiedUser._id
        })

        if(!postDeleted) throw new Error("Post not found")

        return "Post Deleted"
    }
}

const createComment = {
    type: CommentType,
    description: "Create a comment of a post",
    args: {
        comment: {type: GraphQLString},
        postId: {type: GraphQLID}
    },
    resolve: async (_, {comment, postId}, {verifiedUser}) => {
        if(!verifiedUser) throw new Error("You have to login to make a comment")
        
        const newComment = new Comment({
            comment,
            postId,
            userId: verifiedUser._id,
        });
        return newComment.save();
    }
}

const updateComment = {
    type: CommentType,
    description: "Update a comment by id",
    args: {
        id: {type: GraphQLID},
        comment: {type: GraphQLString}
    },
    resolve: async (_, {id, comment}, {verifiedUser}) => {
        if(!verifiedUser) throw new Error("Unauthorized")

        const commentUpdated = await Comment.findByIdAndUpdate(
            {_id: id, userId: verifiedUser._id},
            {comment}
        );

        if(!commentUpdated) throw new Error("Comment not found")

        return commentUpdated;
    }
}


module.exports = {
    register,
    login,
    createPost,
    updatePost,
    deletePost,
    createComment,
    updateComment
}