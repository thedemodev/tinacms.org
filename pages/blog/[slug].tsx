import matter from 'gray-matter'
import styled from 'styled-components'
const fg = require('fast-glob')
import { NextSeo } from 'next-seo'
import { useLocalMarkdownForm } from 'next-tinacms-markdown'
import { InlineForm } from 'react-tinacms-inline'

import { formatDate, formatExcerpt, readFile } from '../../utils'
import {
  Layout,
  Hero,
  Wrapper,
  MarkdownContent,
  RichTextWrapper,
} from '../../components/layout'
import {
  EditToggle,
  DiscardButton,
  InlineWysiwyg,
  InlineTextareaField,
  InlineTextField,
  InlineControls,
} from '../../components/ui/inline'

export default function BlogTemplate({ markdownFile, siteConfig }) {
  // Registers Tina Form
  const [data, form] = useLocalMarkdownForm(markdownFile, formOptions)
  const frontmatter = data.frontmatter
  const markdownBody = data.markdownBody
  const excerpt = data.markdownBody.excerpt

  return (
    <InlineForm form={form}>
      <Layout pathname="/">
        <NextSeo
          title={frontmatter.title}
          titleTemplate={'%s | ' + siteConfig.title + ' Blog'}
          description={excerpt}
          openGraph={{
            title: frontmatter.title,
            description: excerpt,
            images: [
              {
                url:
                  'https://res.cloudinary.com/forestry-demo/image/upload/l_text:tuner-regular.ttf_70:' +
                  encodeURI(frontmatter.title) +
                  ',g_north_west,x_270,y_95,w_840,c_fit,co_rgb:EC4815/l_text:tuner-regular.ttf_35:' +
                  encodeURI(frontmatter.author) +
                  ',g_north_west,x_270,y_500,w_840,c_fit,co_rgb:241748/v1581087220/TinaCMS/tinacms-social-empty.png',
                width: 1200,
                height: 628,
                alt: frontmatter.title + ` | TinaCMS Blog`,
              },
            ],
          }}
        />
        <Hero>
          <InlineTextareaField name="frontmatter.title" />
        </Hero>
        <BlogWrapper>
          {/*
           *** Inline controls shouldn't render
           *** until we're ready for Inline release
           */}
          {/*
            <InlineControls>
            <EditToggle />
            <DiscardButton />
            </InlineControls>
          */}
          <RichTextWrapper>
            <BlogMeta>
              <p>
                <span>By: </span>
                <InlineTextField name="frontmatter.author" />
              </p>
              <p>{formatDate(frontmatter.date)}</p>
            </BlogMeta>
            <InlineWysiwyg name="markdownBody">
              <MarkdownContent escapeHtml={false} content={markdownBody} />
            </InlineWysiwyg>
          </RichTextWrapper>
        </BlogWrapper>
      </Layout>
    </InlineForm>
  )
}

/*
 ** DATA FETCHING --------------------------------------------------
 */

export async function unstable_getStaticProps(ctx) {
  const { slug } = ctx.params
  //TODO - change to fs.readFile once we move to getStaticProps
  const content = await readFile(`content/blog/${slug}.md`)
  const siteConfig = await import('../../content/siteConfig.json')
  const post = matter(content)

  return {
    props: {
      siteConfig: {
        title: siteConfig.title,
      },
      markdownFile: {
        fileRelativePath: `content/blog/${slug}.md`,
        frontmatter: post.data,
        markdownBody: post.content,
        excerpt: formatExcerpt(post.content),
      },
    },
  }
}

export async function unstable_getStaticPaths() {
  const blogs = await fg(`./content/blog/**/*.md`)
  return blogs.map(file => {
    const slug = file
      .split('/blog/')[1]
      .replace(/ /g, '-')
      .slice(0, -3)
      .trim()
    return { params: { slug } }
  })
}

/*
 ** TINA FORM CONFIG --------------------------------------------------
 */

const formOptions = {
  label: 'Blog Post',
  fields: [
    {
      label: 'Title',
      name: 'frontmatter.title',
      component: 'text',
    },
    {
      label: 'Author',
      name: 'frontmatter.author',
      component: 'text',
    },
    /*
     ** TODO: add this back in once
     ** draft functionality works again
     */
    // {
    //   name: 'frontmatter.draft',
    //   component: 'toggle',
    //   label: 'Draft',
    // },
    {
      label: 'Date Posted',
      name: 'frontmatter.date',
      component: 'date',
      dateFormat: 'MMMM DD YYYY',
      timeFormat: false,
    },
    {
      label: 'Blog Body',
      name: 'markdownBody',
      component: 'markdown',
    },
  ],
}

/*
 ** STYLES ---------------------------------------------------------
 */

const BlogWrapper = styled(Wrapper)`
  padding-top: 4rem;
  padding-bottom: 3rem;
  max-width: 768px;

  h1,
  .h1,
  h2,
  .h2 {
    color: var(--color-primary);
    em {
      color: var(--color-primary);
      font-style: italic;
    }
  }

  h3,
  .h3,
  h4,
  .h4 {
    color: var(--color-secondary);
    em {
      color: var(--color-secondary);
      font-style: italic;
    }
  }

  h1,
  .h1 {
    font-size: 2rem;
    @media (min-width: 800px) {
      font-size: 3rem;
    }

    @media (min-width: 1200px) {
      font-size: 2.5rem;
    }
  }

  h2,
  .h2 {
    font-size: 1.625rem;
  }
`

const BlogMeta = styled.div`
  width: 100%;
  justify-content: space-between;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  margin-bottom: 1.5rem;
  margin-top: -0.5rem;
  opacity: 0.5;
  p {
    margin: 0;
    color: 0;
    display: block;
  }
  span {
    opacity: 0.5;
  }

  @media (min-width: 550px) {
    flex-direction: row;
  }
`
