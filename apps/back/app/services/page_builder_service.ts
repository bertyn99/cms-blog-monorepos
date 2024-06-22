import Page from '#models/page'
import PageTranslation from '#models/page_translation'
import PageVersion from '#models/page_version'
import Block from '#models/block'
import { inject } from '@adonisjs/fold'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class PageService {
  public async createPage(data: {
    authorId: number
    translations: Array<{
      lang: string
      title: string
      slug: string
      metadata: object
    }>
    content: Array<{
      name: string
      type: string
      content: object
    }>
  }) {
    const trx = await db.transaction()

    try {
      const page = await Page.create({ authorId: data.authorId }, { client: trx })

      const translationsSavepoint = await trx.transaction()
      try {
        await page
          .related('translations')
          .createMany(data.translations, { client: translationsSavepoint })
      } catch (error) {
        await translationsSavepoint.rollback()
        throw new Error(`Failed to create translations: ${error.message}`)
      }

      const contentSavepoint = await trx.transaction()
      try {
        await page.related('content').createMany(data.content, { client: contentSavepoint })
      } catch (error) {
        await contentSavepoint.rollback()
        throw new Error(`Failed to create content: ${error.message}`)
      }

      await trx.commit()
      return page
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  public async updatePage(
    pageId: number,
    data: {
      translations?: Array<{
        id?: number
        lang: string
        title: string
        slug: string
        metadata: object
      }>
      content?: Array<{
        id?: number
        name: string
        type: string
        content: object
      }>
    }
  ) {
    const trx = await db.transaction()

    try {
      const page = await Page.findOrFail(pageId, { client: trx })

      if (data.translations) {
        const savepoint = await trx.transaction()
        try {
          for (const translation of data.translations) {
            if (translation.id) {
              const updatedRows = await PageTranslation.query({ client: savepoint })
                .where('id', translation.id)
                .andWhere('page_id', pageId)
                .update(translation)
              if (updatedRows.length === 0) {
                throw new Error(
                  `Translation with id ${translation.id} not found or doesn't belong to this page`
                )
              }
            } else {
              await page.related('translations').create(translation, { client: savepoint })
            }
          }
        } catch (error) {
          await savepoint.rollback()
          throw new Error(`Failed to update translations: ${error.message}`)
        }
      }

      if (data.content) {
        const savepoint = await trx.transaction()
        try {
          //create or update the blocks of content associated with the page
          await page.related('content').updateOrCreateMany(data.content)
        } catch (error) {
          await savepoint.rollback()
          throw new Error(`Failed to update content: ${error.message}`)
        }
      }

      await trx.commit()
      return page
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  public async getPage(pageId: number) {
    try {
      const page = await Page.query()
        .where('id', pageId)
        .preload('translations')
        .preload('content')
        .preload('versions')
        .firstOrFail()

      return page
    } catch (error) {
      throw new Error(`Failed to retrieve page: ${error.message}`)
    }
  }

  public async deletePage(pageId: number) {
    const trx = await db.transaction()

    try {
      const page = await Page.findOrFail(pageId, { client: trx })
      await page.delete()
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw new Error(`Failed to delete page: ${error.message}`)
    }
  }

  public async createPageVersion(pageId: number, authorId: number) {
    const trx = await db.transaction()

    try {
      const page = await Page.query({ client: trx })
        .where('id', pageId)
        .preload('translations')
        .preload('content')
        .firstOrFail()

      const versionData = {
        pageId: page.id,
        authorId,
        payload: {
          ...this.formatTranslationsForStoreVersion(page.translations),
          content: this.formatContentForStoreVerion(page.content),
        },
        metadata: {},
      }

      const pageVersion = await PageVersion.create(versionData, { client: trx })
      await trx.commit()
      return pageVersion
    } catch (error) {
      await trx.rollback()
      throw new Error(`Failed to create page version: ${error.message}`)
    }
  }

  public async restorePageVersion(versionId: number) {
    const trx = await db.transaction()

    try {
      //check if the version exists
      const version = await PageVersion.findOrFail(versionId, { client: trx })

      //find the page with the version id
      const page = await Page.findOrFail(version.pageId, { client: trx })

      try {
        //delete all the current blocks associated with the page
        await Block.query({ client: trx }).where('page_id', page.id).delete()

        //insert the blocks from the previous version to the page
        await page.related('content').updateOrCreateMany(version.payload)
      } catch (error) {
        throw new Error(`Failed to restore content: ${error.message}`)
      }

      const translationsSavepoint = await trx.transaction()
      try {
        await PageTranslation.query({ client: translationsSavepoint })
          .where('page_id', page.id)
          .delete()

        /*         await page
          .related('translations')
          .createMany(version.translations, { client: translationsSavepoint }) */
      } catch (error) {
        await translationsSavepoint.rollback()
        throw new Error(`Failed to restore translations: ${error.message}`)
      }

      await trx.commit()
      return this.getPage(page.id)
    } catch (error) {
      await trx.rollback()
      throw new Error(`Failed to restore page version: ${error.message}`)
    }
  }

  /**
   * Format a version content blocks  in JSON for PageVersion model
   */
  public async formatContentForStoreVerion(content: Block[]) {
    return content.map((block) => {
      return {
        id: block.id,
        name: block.name,
        type: block.type,
        content: block.content,
      }
    })
  }

  public async formatTranslationsForStoreVersion(translations: PageTranslation[]) {
    return translations.reduce(
      (acc: any, translation) => {
        acc.title[translation.lang] = translation.title
        acc.slug[translation.lang] = translation.slug
        return acc
      },
      { title: {}, slug: {} }
    )
  }
}
