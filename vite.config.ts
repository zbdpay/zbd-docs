import { defineConfig } from 'vite'
import { holocron } from '@holocron.so/vite'

export default defineConfig({
  plugins: [holocron()],
  // Inline `scheduler` (react-dom's CJS dep) into the RSC/SSR bundles. Without
  // this, Vercel builds keep it as a bare require that nf3's static tracing
  // can't see (it sits behind the RSC runtime's dynamic requireModule), so the
  // deployed lambda 500s with "Cannot find module 'scheduler'".
  environments: {
    rsc: { resolve: { noExternal: ['scheduler'] } },
    ssr: { resolve: { noExternal: ['scheduler'] } },
  },
})
