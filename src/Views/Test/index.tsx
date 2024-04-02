import { ErrorComponenet } from '@Views/ErrorComponent/ErrorComponent';
import { RenderGraphTestResults } from './GraphTests/RenderGraphTestResults';
// import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';
import { ErrorBoundary } from 'react-error-boundary';
const ada = {};
// export const Test = () => {
//   return (
//     <>
//       <SentryErrorBoundary
//         beforeCapture={(scope) => {
//           scope.setTag('Priority', 'VeryHigh');
//         }}
//         onError={() => {
//           console.log('error occured');
//         }}
//         fallback={<ErrorComponenet />}
//       >
//         <div className="w-[100vw] h-[100vh] bg-red">
//           <button
//             className="p-3 "
//             onClick={() => {
//               ada.dark.them = 'dark';
//             }}
//           >
//             Click Me
//           </button>
//         </div>
//       </SentryErrorBoundary>
//       <SentryErrorBoundary
//         beforeCapture={(scope) => {
//           scope.setTag('Priority', 'VeryHigh');
//         }}
//         onError={() => {
//           console.log('error occured');
//         }}
//         fallback={<ErrorComponenet />}
//       >
//         <div className="w-[100vw] h-[100vh] bg-red">
//           <button
//             className="p-3 "
//             onClick={() => {
//               throw new Error('Click me');
//             }}
//           >
//             Click Me
//           </button>
//         </div>
//       </SentryErrorBoundary>
//     </>
//   );
// };
function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

export const Test = () => {
  return (
    <>
      <ErrorBoundary fallback={fallbackRender}>
        <div className="w-[100vw] h-[100vh] bg-red">
          <button
            className="p-3 "
            onClick={() => {
              ada.dark.them = 'dark';
            }}
          >
            Click Me
          </button>
        </div>
      </ErrorBoundary>
    </>
  );
};
export default Test;

// window.onerror = () => {
//   console.log('error captured');
// };
