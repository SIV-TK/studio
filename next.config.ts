import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        http2: false,
        dns: false,
        crypto: false,
        stream: false,
        zlib: false,
        path: false,
        os: false,
        util: false,
        url: false,
        querystring: false,
        buffer: false,
        events: false,
        assert: false,
        constants: false,
      };
    }
    
    // Exclude server-only modules from client bundle
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        'genkit': 'commonjs genkit',
        '@genkit-ai/core': 'commonjs @genkit-ai/core',
        '@grpc/grpc-js': 'false',
        'http2': 'false',
        'dns': 'false',
      });
    }
    
    return config;
  },
  serverExternalPackages: ['genkit', '@genkit-ai/core', '@grpc/grpc-js'],
};

export default nextConfig;
