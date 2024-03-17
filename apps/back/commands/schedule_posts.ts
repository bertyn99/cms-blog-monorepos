import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import PostService from '#services/post_service';
import { inject } from '@adonisjs/fold'
export default class SchedulePosts extends BaseCommand {
  static commandName = 'schedule:posts'
  static description = ''

  static options: CommandOptions = {
    startApp: true,
  }

  @inject()
  async run(postService: PostService) {
    try {
      await postService.updateScheduledPosts();

      this.logger.info('Scheduled posts successfully.');

    } catch (error) {
      this.logger.error(error.message)
      this.error = error
      this.exitCode = 1
    }
  }
}