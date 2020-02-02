module.exports = {
    port: process.env.PORT || 3001,
    db: process.env.MONGODB || 'mongodb+srv://mplay:PXdu96dxOQkc3rrE@mplay-d7oek.mongodb.net/test?retryWrites=true&w=majority',
    SECRET_TOKEN: 'my-pwd-of-tokens'
}