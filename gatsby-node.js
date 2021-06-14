const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allDatoCmsWork {
          edges {
            node {
              slug
            }
          }
        }
      }
    `).then(result => {
      result.data.allDatoCmsWork.edges.map(({ node: work }) => {
        createPage({
          path: `works/${work.slug}`,
          component: path.resolve(`./src/templates/work.js`),
          context: {
            slug: work.slug,
          },
        })
      })
      resolve()
    })
  })
}
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    interface TeamMember {
      name: String!
      firstName: String!
      email: String!
    }
    type AuthorJson implements Node & TeamMember {
      name: String!
      firstName: String!
      email: String!
      joinedAt: Date
    }
    type ContributorJson implements Node & TeamMember {
      name: String!
      firstName: String!
      email: String!
      receivedSwag: Boolean
    }
  `
  createTypes(typeDefs)
}
exports.createResolvers = ({ createResolvers }) => {
  const fullName = {
    type: "String",
    resolve(source, args, context, info) {
      return source.firstName + " " + source.name
    },
  }
  const resolvers = {
    Query: {
      allTeamMembers: {
        type: ["TeamMember"],
        resolve(source, args, context, info) {
          return context.nodeModel.getAllNodes({ type: "TeamMember" })
        },
      },
    },
    AuthorJson: {
      fullName,
    },
    ContributorJson: {
      fullName,
    },
  }
  createResolvers(resolvers)
}
