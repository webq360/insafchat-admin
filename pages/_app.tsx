import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html, body {
            width: 100%;
            height: 100%;
            font-family: system-ui, -apple-system, sans-serif;
          }

          #__next {
            width: 100%;
            min-height: 100vh;
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(20px);
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.8;
            }
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes shake {
            0%, 100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-5px);
            }
            75% {
              transform: translateX(5px);
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          input:hover {
            border-color: #10B981 !important;
            background: white !important;
          }

          input:focus {
            border-color: #10B981 !important;
            background: white !important;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
          }

          button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4) !important;
          }

          button:active:not(:disabled) {
            transform: translateY(0);
          }

          button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          /* Smooth scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }

          ::-webkit-scrollbar-thumb {
            background: #10B981;
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #059669;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            #__next {
              font-size: 14px;
            }

            h1 {
              font-size: 24px !important;
            }

            h2 {
              font-size: 20px !important;
            }
          }

          /* Table Hover Effects */
          tbody tr:hover {
            background: #f9fafb !important;
          }

          /* Card Hover Effects */
          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;
          }
        `}</style>
      </Head>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </>
  );
}
