"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DysonPurelink_1 = require("./DysonPurelink");
module.exports = function (RED) {
    function sensorNode(config) {
        RED.nodes.createNode(this, config);
        var configNode = RED.nodes.getNode(config.confignode);
        var node = this;
        this.config = configNode;
        try {
            node.on('input', function (msg) {
                cronCheckJob(msg, node, node.config);
            });
        }
        catch (err) {
            node.error('Error: ' + err.message);
            node.status({ fill: "red", shape: "ring", text: err.message });
        }
    }
    function cronCheckJob(msg, node, config) {
        var pureLink = new DysonPurelink_1.DysonPurelink(config.username, config.password);
        pureLink.getDevices().then(function (devices) {
            if (!Array.isArray(devices) || devices.length === 0) {
                node.log('No devices found');
                return;
            }
            switch (msg.action) {
                case 'turnOn':
                    devices[0].turnOn();
                    break;
                case 'turnOff':
                    devices[0].turnOff();
                    break;
                case 'setRotation':
                    devices[0].setRotation(msg.rotation).then(function (t) { return node.send({ payload: t }); });
                    break;
                case 'setFanSpeed':
                    devices[0].setFanSpeed(msg.speed).then(function (t) { return node.send({ payload: t }); });
                    break;
            }
        }).catch(function (err) { return node.error(err); });
    }
    RED.nodes.registerType("dyson-action", sensorNode);
};
