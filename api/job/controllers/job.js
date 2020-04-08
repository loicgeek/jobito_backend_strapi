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
    if (ctx.state.user.type != "enterprise") {
      return ctx.unauthorized(`You can't add a job`);
    }
    if (ctx.is('multipart')) {
      const {
        data,
        files
      } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services.job.create(data, {
        files
      });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services.job.create(ctx.request.body);
    }
    return sanitizeEntity(entity, {
      model: strapi.models.job
    });
  },

  /*
   * Save application for a job for the current user
   */
  async applyJob(ctx) {
    let entity;
    ctx.request.body.user = ctx.state.user.id;
    ctx.request.body.job = ctx.params.id;
    entity = await strapi.services['job-application'].create(ctx.request.body);


    return sanitizeEntity(entity, {
      model: strapi.models['job-application']
    });
  },

    /*
   * Save a report for a job for the current user
   */
  async reportJob(ctx) {
    let entity;
    ctx.request.body.user = ctx.state.user.id;
    ctx.request.body.job = ctx.params.id;
    entity = await strapi.services['job-report'].create(ctx.request.body);
    return sanitizeEntity(entity, {
      model: strapi.models['job-report']
    });
  },

      /*
   * Save a report for a job for the current user
   */
  async getReports(ctx) {
    const reports = await strapi.services['job-report'].find({
      'job.id': ctx.params.id,
    });
    if (reports.length == 0) {
      return reports;
    }

    return reports.map((entity) => sanitizeEntity(entity, {
      model: strapi.models['job-report']
    }));
  },

  /*
   * Close a job
   */
  async closeJob(ctx) {
    const [job] = await strapi.services.job.find({
      id: ctx.params.id,
      'user.id': ctx.state.user.id,
    });

    if (!job) {
      return ctx.unauthorized(`You can't close this job`);
    }

    ctx.request.body.status = "close";
    let entity = await strapi.services.job.update(
      ctx.params,
      ctx.request.body
    );


    return sanitizeEntity(entity, {
      model: strapi.models.job
    });
  },

  async incrementView(ctx) {
    const [job] = await strapi.services.job.find({
      id: ctx.params.id
    });
    console.log(job);
    ctx.request.body.view_count = job.view_count + 1;
    let entity = await strapi.services.job.update(
      ctx.params,
      ctx.request.body
    );


    return sanitizeEntity(entity, {
      model: strapi.models.job
    });
  },

  /*
   * Get all applications for the current  job
   */
  async getApplications(ctx) {
    
    const applications = await strapi.services['job-application'].find({
      'job.id': ctx.params.id,
    });
    console.log(applications);
    if (applications.length == 0) {
      return applications;
    }

    return applications.map((entity) => sanitizeEntity(entity, {
      model: strapi.models['job-application']
    }));
  }


};
