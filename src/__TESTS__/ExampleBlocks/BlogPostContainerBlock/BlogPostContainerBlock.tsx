import React, { useEffect, useState } from "react";

import { IBlockRegistryOption } from "../../../types";
import { gql, useLazyQuery } from "@apollo/client";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: {
    text: string;
  };
  images: {
    url: string;
  }[];
  featured: boolean;
  updatedAt: string;
};
// Add the query to the page query at ./app/src/queries.ts
export const BlogPostContainerBlockQuery = `
  ... on  BlogPostContainer {
    id
    showFeatured
  }
`;

const GET_BLOG_POSTS = gql`
  query getBlogPosts {
    blogPosts {
      id
      title
      slug
      content {
        text
      }
      images {
        url
      }
      featured
      updatedAt
    }
  }
`;

interface IBlogPostContainerState {
  blogPosts: BlogPost[];
  featuredBlogPost: BlogPost | null;
  errorCode: number | null;
}

export interface IBlogPostContainerBlockProps {
  __typename: "BlogPostContainer";
  id: string;
  showFeatured?: boolean;
}

// Add these options to the block registry at ./app/src/components/BlockManager/registry.tsx
export const BlogPostContainerBlockOptions: IBlockRegistryOption = {
  __typename: "BlogPostContainer",
  component: (index: number, rest: IBlogPostContainerBlockProps) => (
    <BlogPostContainerBlock key={index} {...rest} />
  ),
  cols: 3,
};

export const BlogPostContainerBlock: React.FC<IBlogPostContainerBlockProps> = ({
  showFeatured,
}) => {
  const [{ blogPosts, featuredBlogPost, errorCode }, setState] =
    useState<IBlogPostContainerState>({
      blogPosts: [],
      featuredBlogPost: null,
      errorCode: null,
    });
  const [loadBlogPosts, { called, data, loading, error }] = useLazyQuery<{
    blogPosts: BlogPost[];
  }>(GET_BLOG_POSTS);

  const getShortText = (text: string, length: number) => {
    if (text.length <= length) {
      return text;
    }

    const words = text.split(" ");

    let output = "";
    while (
      output.length < length &&
      words.length > 0 &&
      output.length + words[0].length <= length
    ) {
      output += words.shift() + " ";
    }

    return output.trimEnd() + "...";
  };

  useEffect(() => {
    loadBlogPosts();
  }, [loadBlogPosts]);

  useEffect(() => {
    if (error) {
      setState((s) => ({ ...s, errorCode: 500 }));

      return;
    }

    if (!loading && data && data.blogPosts) {
      if (showFeatured) {
        // order posts by updatedDate, take first with featured
        let otherPosts: BlogPost[] = [];
        const featuredPost = data.blogPosts

          .sort((a, b) => {
            if (a.updatedAt > b.updatedAt) {
              return -1;
            } else if (a.updatedAt < b.updatedAt) {
              return 1;
            } else {
              return 0;
            }
          })
          .filter((post) => post.featured)[0];

        if (featuredPost) {
          otherPosts = data.blogPosts.filter(
            (post) => post.id !== featuredPost.id
          );
        } else {
          otherPosts = data.blogPosts;
        }

        setState((s) => {
          return {
            ...s,
            blogPosts: otherPosts,
            featuredBlogPost: featuredPost || null,
          };
        });
      } else {
        setState((s) => {
          return {
            ...s,
            blogPosts: data.blogPosts,
          };
        });
      }
    }
  }, [data, loading, error]);
  return (
    <>
      {showFeatured && featuredBlogPost ? (
        <>
          <div className="featured-blog-post">
            <h1 className="text-center display-4 mb-0">
              Today's Featured Article
            </h1>
          </div>

          <div className="mb-5">
            <div className="featuredBlog">
              <div className="row gx-0">
                <div className="col">
                  <div className="featuredBlogImg">
                    <img
                      src={featuredBlogPost.images[0].url}
                      alt={"featured blog image"}
                      width={640}
                      height={360}
                    />
                  </div>
                </div>
                <div className="col position-relative bg-brand5">
                  <div className="featuredBlogInfo">
                    <h3>{featuredBlogPost.title}</h3>
                    <p className="text-v1C">
                      {new Date(featuredBlogPost.updatedAt).toDateString()}
                    </p>
                    <p>{getShortText(featuredBlogPost.content.text, 240)}</p>
                    <div className="readMoreBtn">
                      <a href={featuredBlogPost.slug} className="btn">
                        read more...
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      <div className="container">
        <div className="position-relative mb-4">
          <h1 className="text-center display-4 mb-0">
            Recently Featured Articles
          </h1>
        </div>
        {blogPosts && blogPosts.length ? (
          <div className="col g-4 mb-5">
            {blogPosts.map((post, index) => (
              <div className="col d-flex" key={`${post.id}-${index}`}>
                <div key={post.id} className="card recentBlogItem">
                  <img className="blogImg" src={post.images[0].url} />
                  <div className="card-body">
                    <h3 className="card-title">{post.title}</h3>
                    <p className="text-v1C">
                      {new Date(post.updatedAt).toDateString()}
                    </p>
                    <p className="card-text">
                      {getShortText(post.content.text, 120)}
                    </p>
                  </div>
                  <div className="recentBlogFooter card-footer">
                    <div className="readMoreBtn">
                      <a href={post.slug} className="btn">
                        read more...
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>no blog posts</p>
        )}
      </div>
    </>
  );
};
