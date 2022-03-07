const { GraphQLString, GraphQLList, GraphQLID } = require("graphql");
const { User, Post, Comment } = require("../models");
const { UserType, PostType, CommentType } = require("./types");

const users = {
  type: new GraphQLList(UserType),
  description: "Return a list of users",
  resolve() {
    return User.find();
  },
};

const user = {
  type: UserType,
  description: "Get a single user by id",
  args: {
    id: { type: GraphQLID },
  },
  resolve(_, args) {
    return User.findById(args.id);
  },
};

const posts = {
  type: new GraphQLList(PostType),
  description: "Return a list of posts",
  resolve: () => Post.find(),
};

const post = {
  type: PostType,
  description: "Get a single post by id",
  args: {
    id: { type: GraphQLID },
  },
  resolve: (_, args) => Post.findById(args.id),
};

const comments = {
  type: new GraphQLList(CommentType),
  description: "Get all comments",
  resolve: () => Comment.find(),
};

const comment = {
  type: CommentType,
  description: "Get a single comment by id",
  args: {
    id: { type: GraphQLID },
  },
  resolve: (_, { id }) =>Comment.findById(id)
};

module.exports = {
  users,
  user,
  posts,
  post,
  comments,
  comment,
};
