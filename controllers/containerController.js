const Docker = require('dockerode');
const docker = new Docker();

const crypto = require('crypto');
function generateRandomPassword(length = 12) {
    return crypto.randomBytes(length).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, length);
}

function getAllHostIPs() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    const results = {};

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
            if (net.family === familyV4Value && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }

    return results;
}

const createContainer = async (req, res) => {
    try {
        if (!req.body.imageName) {
            return res.status(400).json({ message: 'imageName is required in the request body' });
        }
        const ipResults = getAllHostIPs();
        const interfaceName = 'eno1'
        const hostIP = ipResults[interfaceName]?.[0] || '127.0.0.1'

        const password = generateRandomPassword();
        const username = req.body.username;

        const container = await docker.createContainer({
            Image: req.body.imageName,
            Tty: true,
            Env: [
                `SSH_USERNAME=${username}`,
                `SSH_PASSWORD=${password}`
            ],
            ExposedPorts: {
                '22/tcp': {}
            },
            HostConfig: {
                PortBindings: {
                    '22/tcp': [{ HostPort: '0' }]
                }
            }
        });

        await container.start();

        const info = await container.inspect();
        const sshPort = info.NetworkSettings.Ports['22/tcp'][0].HostPort;

        res.status(201).json({
            status: 'success',
            data: {
                containerId: container.id,
                sshPort: sshPort,
                username: username,
                password: password,
                hostIP: hostIP
            }
        });
    } catch (err) {
        console.error('Error creating container:', err);
        res.status(500).json({ message: 'Failed to create container', error: err.message });
    }
};

const removeContainer = async (req, res) => {
    try {
        const container = docker.getContainer(req.body.containerId)
        await container.stop({ t: 2 })
        await container.remove({ force: true, v: true })
        res.status(204).json({})
    } catch (err) {
        if (err.statusCode === 500) {
            res.status(500).json({
                status: 'failed',
                message: 'Internal server error'
            })
        }
        else {
            res.status(500).json({
                status: 'failed',
                message: 'Unknown error'
            })
        }
    }
}

const restartContainer = async (req, res) => {
    try {
        const container = docker.getContainer(req.body.containerId)
        await container.restart()
        res.status(200).json({
            status: "success",
            message: "Container successfully restarted"
        })
    } catch (err) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to restart container',
        })
    }
}

module.exports = {
    createContainer,
    removeContainer,
    restartContainer
};
