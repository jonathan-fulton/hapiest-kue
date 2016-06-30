'use strict';

const JobCreationServiceFactory = require('./jobCreationServiceFactory');
const JobProcessingServiceFactory = require('./jobProcessingServiceFactory');
const QueueFactory = require('./queueFactory');

class HapiestKueFactory {

    /**
     * @returns {JobCreationServiceFactory}
     */
    static jobCreationServiceFactory() {
        return JobCreationServiceFactory;
    }

    /**
     * @returns {JobProcessingServiceFactory}
     */
    static jobProcessingServiceFactory() {
        return JobProcessingServiceFactory;
    }

    /**
     * @returns {QueueFactory}
     */
    static queueFactory() {
        return QueueFactory;
    }

}

module.exports = HapiestKueFactory;