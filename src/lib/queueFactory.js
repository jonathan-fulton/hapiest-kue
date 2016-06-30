'use strict';

const Kue = require('kue');

class QueueFactory {

    /**
     * Config should match kue documentation for options as it's passed in directly to kue.createQueue()
     *
     * @param {Config} nodeConfig
     * @param {string} nodeConfigPath
     * @returns {Queue}
     */
    static createQueueFromNodeConfig(nodeConfig, nodeConfigPath) {
        const config = nodeConfig.get(nodeConfigPath);
        return QueueFactory.createQueue(config);
    }

    /**
     * @param {Object} config - refer to kue documentation for options
     * @returns {Queue}
     */
    static createQueue(config) {
        return Kue.createQueue(config);
    }

}

module.exports = QueueFactory;
