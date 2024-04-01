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
export const Test = () => {
  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorComponenet}>
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
      <ErrorBoundary FallbackComponent={ErrorComponenet}>
        <div className="w-[100vw] h-[100vh] bg-red">
          <button
            className="p-3 "
            onClick={() => {
              throw new Error('Click me');
            }}
          >
            Click Me
          </button>
        </div>
      </ErrorBoundary>
    </>
  );
};
