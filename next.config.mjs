/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
            {
                hostname: "firebasestorage.googleapis.com",
            },
        ],
    },
    async headers() {
        return [{
            source: "/api/:path*",
            headers: [
                {
                    key: "Access-control-allow-credentials", value: "true"
                },
                {
                    key: "Access-control-allow-origin", value: "*"
                },
                {
                    key: "Access-control-allow-methods", value: "GET,DELETE,PATCH,POST,PUT"
                },
                {
                    key: "Access-control-allow-headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-LengthContent-MD5, Content-Type, Date, X-Api-Version"
                }
            ]
        }]
    }
};

export default nextConfig;
