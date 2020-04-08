'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const {
  parseMultipartData,
  sanitizeEntity
} = require('strapi-utils');

module.exports = {

  /**
   * Create a record.
   *
   * @return {Object}
   */
  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const {
        data,
        files
      } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services['user-profile'].create(data, {
        files
      });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services['user-profile'].create(ctx.request.body);
    }
    return sanitizeEntity(entity, {
      model: strapi.models['user-profile']
    });
  },
};
