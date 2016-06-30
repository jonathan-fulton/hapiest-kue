'use strict';

const Should = require('should');
const NodeConfig = require('config');
const Kue = require('kue');
const LoggerFactory = require('hapiest-logger/lib/loggerFactory');
const logger = LoggerFactory.createLogger({
    enabled: true,
    consoleTransport: {enabled: true, level: 'info'},
    logglyTransport: {enabled: false}
});
const JobCreationServiceFactory = require('../../lib/jobCreationServiceFactory');
const JobProcessingServiceFactory = require('../../lib/jobProcessingServiceFactory');

/** @type {JobCreationService} */
var creationService;
/** @type {JobProcessingService} */
var processingService;
/** @type {Queue} */
var queue;

describe('JobProcessingFactory', function() {

    beforeEach(() => {
        // kue.createQueue leverages a singleton underneath the hood
        // To test creating Queue's with different settings, we need to null out the singleton to allow re-create
        Kue.singleton = null;

        creationService = JobCreationServiceFactory.createFromNodeConfig(NodeConfig, 'queue', logger);
        processingService = JobProcessingServiceFactory.createFromNodeConfig(NodeConfig, 'queue', logger);
    });

    describe('registerJobProcessor', function() {

        it('Should process two email jobs', function() {
            const jobIdsToProcess = [];
            const jobsProcessed = [];
            return Promise.resolve()
                .then(() => creationService.createJob('email', {email: 'john.doe@gmail.com', body:'Hello, world!'}, {priority: 'high', ttlInMs: 1000}))
                .then(job => jobIdsToProcess.push(job.id))
                .then(() => creationService.createJob('email', {email: 'jane.doe@gmail.com', body:'Oh no!'}, {ttlInMs: 1000}))
                .then(job => jobIdsToProcess.push(job.id))
                .then(() => {
                    return new Promise((resolve) => {
                        processingService.registerJobProcessor('email', (jobId, data) => {
                            jobsProcessed.push({
                                jobId: jobId,
                                data: data
                            });
                            return Promise.resolve(true);
                        }, 1);
                        setTimeout(() => resolve(), 1000); // Give it 1 second to process stuff
                    });
                })
                .then(() => {
                    jobsProcessed.length.should.eql(2);
                    jobsProcessed[0].jobId.should.be.lessThan(jobsProcessed[1].jobId);
                    jobsProcessed[0].data.email.should.eql('john.doe@gmail.com');
                    jobsProcessed[0].data.body.should.eql('Hello, world!');
                    jobsProcessed[1].data.email.should.eql('jane.doe@gmail.com');
                    jobsProcessed[1].data.body.should.eql('Oh no!');
                })
        })

    });

});