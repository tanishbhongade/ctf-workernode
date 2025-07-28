const crypto = require('crypto')

const protect = (req, res, next) => {
    const signature = req.headers['x-signature']
    const secret = process.env.HMAC_SECRET

    if (!signature || !secret) {
        return res.status(403).json({ message: 'Missing signature or server misconfigured' })
    }

    const payloadString = JSON.stringify(req.body)
    const expectedSignature = crypto.createHmac('sha256', secret).update(payloadString).digest('hex')

    if (signature !== expectedSignature) {
        return res.status(403).json({ message: 'Invalid signature' })
    }

    next()
}

module.exports = { protect }