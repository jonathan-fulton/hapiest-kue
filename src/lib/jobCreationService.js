'use strict';

const Promise = require('bluebird');

class JobCreationService {

    /**
     * @param {Queue} queue
     * @param {Logger} logger
     */
    constructor(queue, logger) {
        this._queue = queue;
        this._logger = logger;
    }

    /**
     * @name JobOptions
     * @type {Object}
     * @property {String} [priority]
     * @property {String} [attempts]
     * @property {Object|boolean} [backoff] - see Kue documentation for options (https://github.com/Automattic/kue#failure-backoff)
     * @property {int} [ttlInMs]
     * @property {Boolean} [removeOnComplete] - defaults to true
     */

    /**
     * @param {String} jobType - key that will enable the job to be processed; should be descriptive
     * @param {Object} jobArguments - arbitrary data passed to the job
     * @param {JobOptions} [jobOptions]
     *
     * @returns {Promise.<Job>}
     */
    createJob(jobType, jobArguments, jobOptions) {
        jobOptions = jobOptions || {};
        if (!jobOptions.hasOwnProperty('removeOnComplete')) {
            jobOptions.removeOnComplete = true;
        }

        var job = this._queue.create(jobType, jobArguments);

        if (jobOptions.priority) {
            job = job.priority(jobOptions.priority);
        }
        if (jobOptions.attempts) {
            job = job.attempts(jobOptions.attempts);
        }
        if (jobOptions.backoff) {
            job = job.backoff(jobOptions.backoff);
        }
        if (jobOptions.ttlInMs) {
            job = job.ttl(jobOptions.ttlInMs);
        }
        if (jobOptions.removeOnComplete) {
            job.removeOnComplete(true);
        }

        return new Promise((resolve, reject) => {
            job.save(err => {
                if (err) {
                    this._logger.error(`Failed to create ${jobType} job`, {jobArguments: jobArguments, err: err});
                    reject(err);
                } else {
                    this._logger.info(`Successfully created ${jobType} job`, {jobId: job.id, jobArguments: jobArguments});
                    resolve(job);
                }
            })
        })
    }

}

module.exports = JobCreationService;
